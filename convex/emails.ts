import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveEmail = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emails", {
      email: args.email,
      name: args.name,
      timestamp: args.timestamp,
    });
  },
});
