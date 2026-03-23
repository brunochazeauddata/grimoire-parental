import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  emails: defineTable({
    email: v.string(),
    name: v.string(),
    timestamp: v.string(),
  }),
  delays: defineTable({
    levelId: v.number(),
    delayDays: v.number(),  // Changé de delayWeeks à delayDays
    userName: v.string(),
    timestamp: v.string(),
  }),
});
