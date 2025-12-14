import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all people
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("people").collect();
  },
});

// Get count of people
export const count = query({
  handler: async (ctx) => {
    const people = await ctx.db.query("people").collect();
    return people.length;
  },
});

// Add a person
export const add = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
    drink: v.optional(v.string()),
    food: v.optional(v.string()),
    workingOn: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate by email
    const existing = await ctx.db
      .query("people")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) {
      return { skipped: true, id: existing._id };
    }
    const id = await ctx.db.insert("people", {
      ...args,
      sentCredits: false,
    });
    return { skipped: false, id };
  },
});

// Mark person as sent credits
export const markSent = mutation({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { sentCredits: true });
  },
});

// Delete a person
export const remove = mutation({
  args: { id: v.id("people") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});