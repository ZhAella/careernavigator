import { 
  users, 
  opportunities, 
  userOpportunityMatches, 
  chatSessions,
  type User, 
  type InsertUser,
  type Opportunity,
  type InsertOpportunity,
  type UserOpportunityMatch,
  type InsertUserOpportunityMatch,
  type ChatSession,
  type InsertChatSession
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Opportunity operations
  getAllOpportunities(): Promise<Opportunity[]>;
  getOpportunity(id: number): Promise<Opportunity | undefined>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  getActiveOpportunities(): Promise<Opportunity[]>;

  // User-Opportunity Match operations
  createMatch(match: InsertUserOpportunityMatch): Promise<UserOpportunityMatch>;
  getUserMatches(userId: number): Promise<(UserOpportunityMatch & { opportunity: Opportunity })[]>;
  updateMatchStatus(matchId: number, status: string): Promise<UserOpportunityMatch>;

  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getUserChatSessions(userId: number): Promise<ChatSession[]>;
  updateChatSession(id: number, messages: any): Promise<ChatSession>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return await db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    const [opportunity] = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return opportunity || undefined;
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const [opportunity] = await db
      .insert(opportunities)
      .values(insertOpportunity)
      .returning();
    return opportunity;
  }

  async getActiveOpportunities(): Promise<Opportunity[]> {
    return await db
      .select()
      .from(opportunities)
      .where(and(eq(opportunities.isActive, true), gte(opportunities.deadline, new Date())))
      .orderBy(desc(opportunities.deadline));
  }

  async createMatch(insertMatch: InsertUserOpportunityMatch): Promise<UserOpportunityMatch> {
    const [match] = await db
      .insert(userOpportunityMatches)
      .values(insertMatch)
      .returning();
    return match;
  }

  async getUserMatches(userId: number): Promise<(UserOpportunityMatch & { opportunity: Opportunity })[]> {
    return await db
      .select({
        id: userOpportunityMatches.id,
        userId: userOpportunityMatches.userId,
        opportunityId: userOpportunityMatches.opportunityId,
        matchPercentage: userOpportunityMatches.matchPercentage,
        aiReasoning: userOpportunityMatches.aiReasoning,
        status: userOpportunityMatches.status,
        createdAt: userOpportunityMatches.createdAt,
        opportunity: {
          id: opportunities.id,
          title: opportunities.title,
          organization: opportunities.organization,
          type: opportunities.type,
          description: opportunities.description,
          location: opportunities.location,
          country: opportunities.country,
          deadline: opportunities.deadline,
          salary: opportunities.salary,
          requirements: opportunities.requirements,
          skills: opportunities.skills,
          matchingCriteria: opportunities.matchingCriteria,
          applicationUrl: opportunities.applicationUrl,
          isActive: opportunities.isActive,
          createdAt: opportunities.createdAt,
        }
      })
      .from(userOpportunityMatches)
      .innerJoin(opportunities, eq(userOpportunityMatches.opportunityId, opportunities.id))
      .where(eq(userOpportunityMatches.userId, userId))
      .orderBy(desc(userOpportunityMatches.matchPercentage));
  }

  async updateMatchStatus(matchId: number, status: string): Promise<UserOpportunityMatch> {
    const [match] = await db
      .update(userOpportunityMatches)
      .set({ status })
      .where(eq(userOpportunityMatches.id, matchId))
      .returning();
    return match;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values({
        ...insertSession,
        updatedAt: new Date(),
      })
      .returning();
    return session;
  }

  async getUserChatSessions(userId: number): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
  }

  async updateChatSession(id: number, messages: any): Promise<ChatSession> {
    const [session] = await db
      .update(chatSessions)
      .set({
        messages,
        updatedAt: new Date(),
      })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }
}

export const storage = new DatabaseStorage();
