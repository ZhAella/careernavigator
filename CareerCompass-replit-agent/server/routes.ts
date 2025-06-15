import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processCV, seedOpportunities } from "./services/cvAnalysis";
import { generateAIResponse } from "./services/openai";
import { insertUserSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed opportunities on startup
  await seedOpportunities();

  // User registration/profile
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.json(existingUser);
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(400).json({ error: "Failed to create user" });
    }
  });

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // CV upload and analysis
  app.post("/api/users/:id/cv", upload.single("cv"), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Clean and sanitize CV text to prevent encoding issues
      let cvText = req.file.buffer.toString("utf-8");
      
      // Remove null bytes and other problematic characters
      cvText = cvText.replace(/\x00/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // If text is too short or invalid, create a basic profile
      if (cvText.length < 10) {
        cvText = `${req.file.originalname} - CV uploaded successfully`;
      }
      
      const fileName = req.file.originalname;

      await processCV(userId, cvText, fileName);
      
      res.json({ success: true, message: "CV processed successfully" });
    } catch (error) {
      console.error("CV upload error:", error);
      res.status(500).json({ error: "Failed to process CV" });
    }
  });

  // Quick neural scan (form-based profile creation)
  app.post("/api/users/:id/neural-scan", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { domain, experienceLevel } = req.body;

      await storage.updateUser(userId, {
        domain,
        experienceLevel,
      });

      res.json({ success: true, message: "Neural scan completed" });
    } catch (error) {
      console.error("Neural scan error:", error);
      res.status(500).json({ error: "Failed to complete neural scan" });
    }
  });

  // Get all opportunities
  app.get("/api/opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getActiveOpportunities();
      res.json(opportunities);
    } catch (error) {
      console.error("Opportunities fetch error:", error);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  // Get user's matched opportunities
  app.get("/api/users/:id/matches", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Matches fetch error:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Update match status (saved, applied, etc.)
  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const matchId = parseInt(req.params.id);
      const { status } = req.body;

      const match = await storage.updateMatchStatus(matchId, status);
      res.json(match);
    } catch (error) {
      console.error("Match update error:", error);
      res.status(500).json({ error: "Failed to update match" });
    }
  });

  // AI Chat
  app.post("/api/users/:id/chat", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { messages, sessionId } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const aiResponse = await generateAIResponse(messages, user.neuralProfile || {});
      
      const updatedMessages = [...messages, { role: "assistant", content: aiResponse }];

      if (sessionId) {
        await storage.updateChatSession(sessionId, updatedMessages);
      } else {
        await storage.createChatSession({
          userId,
          messages: updatedMessages,
        });
      }

      res.json({ response: aiResponse, messages: updatedMessages });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get user's chat sessions
  app.get("/api/users/:id/chat-sessions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const sessions = await storage.getUserChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Chat sessions fetch error:", error);
      res.status(500).json({ error: "Failed to fetch chat sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
