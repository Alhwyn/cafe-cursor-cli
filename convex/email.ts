"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { internal } from "./_generated/api";
import { render } from "@react-email/render";
import { CreditEmail } from "../src/emails/CreditEmail";

// Main action to send credit email
export const sendCreditEmail = action({
  args: { personId: v.id("people") },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    // 1. Get person and available credit
    const result = await ctx.runMutation(internal.emailHelpers.getPersonAndAvailableCredit, {
      personId: args.personId,
    });

    if ("error" in result) {
      return { success: false, error: result.error };
    }

    const { person, credit } = result;

    // 2. Assign credit to person
    await ctx.runMutation(internal.emailHelpers.assignCreditToPerson, {
      creditId: credit._id,
      personId: args.personId,
    });

    // 3. Render email template
    const emailHtml = await render(
      CreditEmail({
        firstName: person.firstName,
        creditUrl: credit.url,
        code: credit.code,
        amount: credit.amount,
      })
    );

    // 4. Send email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Revert credit back to available
      await ctx.runMutation(internal.emailHelpers.revertCreditToAvailable, {
        creditId: credit._id,
      });
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) {
      // Revert credit back to available
      await ctx.runMutation(internal.emailHelpers.revertCreditToAvailable, {
        creditId: credit._id,
      });
      return { success: false, error: "RESEND_FROM_EMAIL not configured" };
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: person.email,
      subject: `Your Cursor Credits - $${credit.amount}`,
      html: emailHtml,
    });

    if (error) {
      // Revert credit back to available on send failure
      await ctx.runMutation(internal.emailHelpers.revertCreditToAvailable, {
        creditId: credit._id,
      });
      return { success: false, error: error.message };
    }

    // 5. Mark credit and person as sent
    await ctx.runMutation(internal.emailHelpers.markAsSent, {
      creditId: credit._id,
      personId: args.personId,
    });

    return { success: true };
  },
});
