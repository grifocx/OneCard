import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema, insertTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Card routes
  app.get("/api/cards/today", async (req, res) => {
    try {
      const card = await storage.getTodayCard();
      res.json(card || null);
    } catch (error) {
      console.error("Error getting today's card:", error);
      res.status(500).json({ error: "Failed to get today's card" });
    }
  });

  app.get("/api/cards/history", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : (() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
      })();
      
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const cards = await storage.getCardsByDateRange(start, end);
      res.json(cards);
    } catch (error) {
      console.error("Error getting card history:", error);
      res.status(500).json({ error: "Failed to get card history" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const cardData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(cardData);
      res.json(card);
    } catch (error) {
      console.error("Error creating card:", error);
      res.status(400).json({ error: "Failed to create card" });
    }
  });

  app.post("/api/cards/:id/destroy", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.destroyCard(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error destroying card:", error);
      res.status(500).json({ error: "Failed to destroy card" });
    }
  });

  // Task routes
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTask(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Stats routes
  app.get("/api/stats/streak", async (req, res) => {
    try {
      const stats = await storage.getStreakStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting streak stats:", error);
      res.status(500).json({ error: "Failed to get streak stats" });
    }
  });

  app.get("/api/stats/weekly", async (req, res) => {
    try {
      const stats = await storage.getWeeklyStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting weekly stats:", error);
      res.status(500).json({ error: "Failed to get weekly stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
