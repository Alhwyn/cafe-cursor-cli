import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to get person and available credit
export const getPersonAndAvailableCredit = internalMutation({
  args: { personId: v.id("people") },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.personId);
    if (!person) {
      return { error: "Person not found" };
    }

    // Get an available credit
    const credit = await ctx.db
      .query("credits")
      .withIndex("by_status", (q) => q.eq("status", "available"))
      .first();

    if (!credit) {
      return { error: "No available credits" };
    }

    return { person, credit };
  },
});

// Internal mutation to assign credit to person
export const assignCreditToPerson = internalMutation({
  args: {
    creditId: v.id("credits"),
    personId: v.id("people"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.creditId, {
      assignedTo: args.personId,
      status: "assigned",
    });
  },
});

// Internal mutation to mark everything as sent
export const markAsSent = internalMutation({
  args: {
    creditId: v.id("credits"),
    personId: v.id("people"),
  },
  handler: async (ctx, args) => {
    // Mark credit as sent
    await ctx.db.patch(args.creditId, {
      status: "sent",
      sentAt: Date.now(),
    });

    // Mark person as having received credits
    await ctx.db.patch(args.personId, {
      sentCredits: true,
    });
  },
});

// Internal mutation to revert credit back to available (on send failure)
export const revertCreditToAvailable = internalMutation({
  args: {
    creditId: v.id("credits"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.creditId, {
      status: "available",
      assignedTo: undefined,
    });
  },
});
