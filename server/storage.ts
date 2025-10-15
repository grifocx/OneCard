import { cards, tasks, type Card, type InsertCard, type Task, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Card operations
  getTodayCard(): Promise<(Card & { tasks: Task[] }) | undefined>;
  getCardById(id: string): Promise<(Card & { tasks: Task[] }) | undefined>;
  getCardsByDateRange(startDate: Date, endDate: Date): Promise<(Card & { tasks: Task[] })[]>;
  createCard(card: InsertCard): Promise<Card>;
  destroyCard(id: string): Promise<void>;
  
  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // Stats
  getStreakStats(): Promise<{ currentStreak: number; bestStreak: number }>;
  getWeeklyStats(): Promise<{ tasksCompleted: number; completionRate: number }>;
}

export class DatabaseStorage implements IStorage {
  async getTodayCard(): Promise<(Card & { tasks: Task[] }) | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [card] = await db
      .select()
      .from(cards)
      .where(
        and(
          gte(cards.date, today),
          lte(cards.date, tomorrow),
          eq(cards.destroyed, false)
        )
      )
      .limit(1);

    if (!card) return undefined;

    const cardTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.cardId, card.id))
      .orderBy(tasks.order);

    return { ...card, tasks: cardTasks };
  }

  async getCardById(id: string): Promise<(Card & { tasks: Task[] }) | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    if (!card) return undefined;

    const cardTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.cardId, card.id))
      .orderBy(tasks.order);

    return { ...card, tasks: cardTasks };
  }

  async getCardsByDateRange(startDate: Date, endDate: Date): Promise<(Card & { tasks: Task[] })[]> {
    const cardsList = await db
      .select()
      .from(cards)
      .where(
        and(
          gte(cards.date, startDate),
          lte(cards.date, endDate)
        )
      )
      .orderBy(desc(cards.date));

    const cardsWithTasks = await Promise.all(
      cardsList.map(async (card) => {
        const cardTasks = await db
          .select()
          .from(tasks)
          .where(eq(tasks.cardId, card.id))
          .orderBy(tasks.order);
        return { ...card, tasks: cardTasks };
      })
    );

    return cardsWithTasks;
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db.insert(cards).values(insertCard).returning();
    return card;
  }

  async destroyCard(id: string): Promise<void> {
    await db.update(cards).set({ destroyed: true }).where(eq(cards.id, id));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getStreakStats(): Promise<{ currentStreak: number; bestStreak: number }> {
    const allCards = await db
      .select()
      .from(cards)
      .orderBy(desc(cards.date));

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let previousDate: Date | null = null;

    for (const card of allCards) {
      const cardTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.cardId, card.id));

      const hasCompletedTasks = cardTasks.some(t => t.completed);

      if (hasCompletedTasks) {
        const cardDate = new Date(card.date);
        cardDate.setHours(0, 0, 0, 0);

        if (previousDate) {
          const dayDiff = Math.floor(
            (previousDate.getTime() - cardDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (dayDiff === 1) {
            tempStreak++;
          } else if (dayDiff > 1) {
            bestStreak = Math.max(bestStreak, tempStreak);
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }

        previousDate = cardDate;
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak);

    // Check if today is part of the streak
    if (previousDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor(
        (today.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff <= 1) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
    } else {
      currentStreak = 0;
    }

    return { currentStreak, bestStreak };
  }

  async getWeeklyStats(): Promise<{ tasksCompleted: number; completionRate: number }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const weekCards = await this.getCardsByDateRange(weekAgo, new Date());
    
    let totalTasks = 0;
    let completedTasks = 0;

    weekCards.forEach(card => {
      card.tasks.forEach(task => {
        totalTasks++;
        if (task.completed) completedTasks++;
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { tasksCompleted: completedTasks, completionRate };
  }
}

export const storage = new DatabaseStorage();
