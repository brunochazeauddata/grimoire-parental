import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveDelay = mutation({
  args: {
    levelId: v.number(),
    delayDays: v.number(),  // Changé ici aussi
    userName: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("delays", {
      levelId: args.levelId,
      delayDays: args.delayDays,  // Et ici
      userName: args.userName,
      timestamp: args.timestamp,
    });
  },
});
