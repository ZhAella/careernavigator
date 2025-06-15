import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 100 }),
  experienceLevel: varchar("experience_level", { length: 50 }),
  cvText: text("cv_text"),
  cvFileName: varchar("cv_file_name", { length: 255 }),
  skillsJson: jsonb("skills_json"),
  neuralProfile: jsonb("neural_profile"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // INTERNSHIP, FELLOWSHIP, STUDY_ABROAD, GRANT
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }),
  country: varchar("country", { length: 100 }),
  deadline: timestamp("deadline"),
  salary: varchar("salary", { length: 100 }),
  requirements: text("requirements"),
  skills: jsonb("skills"),
  matchingCriteria: jsonb("matching_criteria"),
  applicationUrl: varchar("application_url", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userOpportunityMatches = pgTable("user_opportunity_matches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  opportunityId: integer("opportunity_id").references(() => opportunities.id).notNull(),
  matchPercentage: decimal("match_percentage", { precision: 5, scale: 2 }).notNull(),
  aiReasoning: text("ai_reasoning"),
  status: varchar("status", { length: 50 }).default("suggested").notNull(), // suggested, saved, applied, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  matches: many(userOpportunityMatches),
  chatSessions: many(chatSessions),
}));

export const opportunitiesRelations = relations(opportunities, ({ many }) => ({
  matches: many(userOpportunityMatches),
}));

export const userOpportunityMatchesRelations = relations(userOpportunityMatches, ({ one }) => ({
  user: one(users, {
    fields: [userOpportunityMatches.userId],
    references: [users.id],
  }),
  opportunity: one(opportunities, {
    fields: [userOpportunityMatches.opportunityId],
    references: [opportunities.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
});

export const insertUserOpportunityMatchSchema = createInsertSchema(userOpportunityMatches).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type UserOpportunityMatch = typeof userOpportunityMatches.$inferSelect;
export type InsertUserOpportunityMatch = z.infer<typeof insertUserOpportunityMatchSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
