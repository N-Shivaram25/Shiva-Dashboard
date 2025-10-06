import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const negativeThoughts = pgTable("negative_thoughts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  thought: text("thought").notNull(),
});

export const positiveThoughts = pgTable("positive_thoughts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  thought: text("thought").notNull(),
});

export const energyLogs = pgTable("energy_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  activity: text("activity").notNull(),
  impact: text("impact").notNull(),
});

export const wellnessLogs = pgTable("wellness_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  activity: text("activity").notNull(),
});

export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  task: text("task").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const entertainment = pgTable("entertainment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  activity: text("activity").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertNegativeThoughtSchema = createInsertSchema(negativeThoughts).omit({ id: true });
export const insertPositiveThoughtSchema = createInsertSchema(positiveThoughts).omit({ id: true });
export const insertEnergyLogSchema = createInsertSchema(energyLogs).omit({ id: true });
export const insertWellnessLogSchema = createInsertSchema(wellnessLogs).omit({ id: true });
export const insertCommunicationSchema = createInsertSchema(communications).omit({ id: true });
export const insertEntertainmentSchema = createInsertSchema(entertainment).omit({ id: true });

export type Goal = typeof goals.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type NegativeThought = typeof negativeThoughts.$inferSelect;
export type PositiveThought = typeof positiveThoughts.$inferSelect;
export type EnergyLog = typeof energyLogs.$inferSelect;
export type WellnessLog = typeof wellnessLogs.$inferSelect;
export type Communication = typeof communications.$inferSelect;
export type Entertainment = typeof entertainment.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertNegativeThought = z.infer<typeof insertNegativeThoughtSchema>;
export type InsertPositiveThought = z.infer<typeof insertPositiveThoughtSchema>;
export type InsertEnergyLog = z.infer<typeof insertEnergyLogSchema>;
export type InsertWellnessLog = z.infer<typeof insertWellnessLogSchema>;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type InsertEntertainment = z.infer<typeof insertEntertainmentSchema>;
