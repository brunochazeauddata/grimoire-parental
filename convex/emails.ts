import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveEmail = mutation({
  args: { 
    email: v.string(), 
    name: v.string(), 
    childrenCount: v.optional(v.string()), // <--- AJOUTE CETTE LIGNE
    timestamp: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emails", { // ou le nom de ta table
      email: args.email,
      name: args.name,
      childrenCount: args.childrenCount, // <--- AJOUTE CETTE LIGNE
      timestamp: args.timestamp,
    });
  },
});
