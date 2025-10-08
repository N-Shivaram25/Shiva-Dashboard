import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
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

export const internships = pgTable("internships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const dsaStreak = pgTable("dsa_streak", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  count: integer("count").notNull().default(0),
});

export const dsTechnologies = pgTable("ds_technologies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
});

export const dsTopics = pgTable("ds_topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  topic: text("topic").notNull(),
});

export const dsCertifications = pgTable("ds_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
});

// College Documents tables
export const collegeDocuments = pgTable("college_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // e.g., "10th Marks", "Aadhaar Card"
  fileName: text("file_name").notNull(),
  fileData: text("file_data").notNull(), // base64 encoded file
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const internshipDocuments = pgTable("internship_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internshipName: text("internship_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const internshipFiles = pgTable("internship_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internshipId: varchar("internship_id").notNull().references(() => internshipDocuments.id, { onDelete: 'cascade' }),
  fileType: text("file_type").notNull(), // "offer_letter", "completion_certificate", "other"
  fileName: text("file_name").notNull(),
  fileData: text("file_data").notNull(), // base64 encoded file
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const certificationDocuments = pgTable("certification_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fileName: text("file_name").notNull(),
  fileData: text("file_data").notNull(), // base64 encoded file
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documentLinks = pgTable("document_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertNegativeThoughtSchema = createInsertSchema(negativeThoughts).omit({ id: true });
export const insertPositiveThoughtSchema = createInsertSchema(positiveThoughts).omit({ id: true });
export const insertEnergyLogSchema = createInsertSchema(energyLogs).omit({ id: true });
export const insertWellnessLogSchema = createInsertSchema(wellnessLogs).omit({ id: true });
export const insertCommunicationSchema = createInsertSchema(communications).omit({ id: true });
export const insertEntertainmentSchema = createInsertSchema(entertainment).omit({ id: true });
export const insertInternshipSchema = createInsertSchema(internships).omit({ id: true });
export const insertCertificationSchema = createInsertSchema(certifications).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertDsaStreakSchema = createInsertSchema(dsaStreak).omit({ id: true });
export const insertDsTechnologySchema = createInsertSchema(dsTechnologies).omit({ id: true });
export const insertDsTopicSchema = createInsertSchema(dsTopics).omit({ id: true });
export const insertDsCertificationSchema = createInsertSchema(dsCertifications).omit({ id: true });
export const insertCollegeDocumentSchema = createInsertSchema(collegeDocuments).omit({ id: true, createdAt: true });
export const insertInternshipDocumentSchema = createInsertSchema(internshipDocuments).omit({ id: true, createdAt: true });
export const insertInternshipFileSchema = createInsertSchema(internshipFiles).omit({ id: true, createdAt: true });
export const insertCertificationDocumentSchema = createInsertSchema(certificationDocuments).omit({ id: true, createdAt: true });
export const insertDocumentLinkSchema = createInsertSchema(documentLinks).omit({ id: true, createdAt: true });

export type Goal = typeof goals.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type NegativeThought = typeof negativeThoughts.$inferSelect;
export type PositiveThought = typeof positiveThoughts.$inferSelect;
export type EnergyLog = typeof energyLogs.$inferSelect;
export type WellnessLog = typeof wellnessLogs.$inferSelect;
export type Communication = typeof communications.$inferSelect;
export type Entertainment = typeof entertainment.$inferSelect;
export type Internship = typeof internships.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type DsaStreak = typeof dsaStreak.$inferSelect;
export type DsTechnology = typeof dsTechnologies.$inferSelect;
export type DsTopic = typeof dsTopics.$inferSelect;
export type DsCertification = typeof dsCertifications.$inferSelect;
export type CollegeDocument = typeof collegeDocuments.$inferSelect;
export type InternshipDocument = typeof internshipDocuments.$inferSelect;
export type InternshipFile = typeof internshipFiles.$inferSelect;
export type CertificationDocument = typeof certificationDocuments.$inferSelect;
export type DocumentLink = typeof documentLinks.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertNegativeThought = z.infer<typeof insertNegativeThoughtSchema>;
export type InsertPositiveThought = z.infer<typeof insertPositiveThoughtSchema>;
export type InsertEnergyLog = z.infer<typeof insertEnergyLogSchema>;
export type InsertWellnessLog = z.infer<typeof insertWellnessLogSchema>;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type InsertEntertainment = z.infer<typeof insertEntertainmentSchema>;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertDsaStreak = z.infer<typeof insertDsaStreakSchema>;
export type InsertDsTechnology = z.infer<typeof insertDsTechnologySchema>;
export type InsertDsTopic = z.infer<typeof insertDsTopicSchema>;
export type InsertDsCertification = z.infer<typeof insertDsCertificationSchema>;
export type InsertCollegeDocument = z.infer<typeof insertCollegeDocumentSchema>;
export type InsertInternshipDocument = z.infer<typeof insertInternshipDocumentSchema>;
export type InsertInternshipFile = z.infer<typeof insertInternshipFileSchema>;
export type InsertCertificationDocument = z.infer<typeof insertCertificationDocumentSchema>;
export type InsertDocumentLink = z.infer<typeof insertDocumentLinkSchema>;
