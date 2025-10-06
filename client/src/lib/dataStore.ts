import { format } from "date-fns";

export interface Goal {
  id: string;
  date: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  date: string;
  title: string;
  completed: boolean;
}

export interface NegativeThought {
  id: string;
  date: string;
  thought: string;
}

export interface PositiveThought {
  id: string;
  date: string;
  thought: string;
}

export interface EnergyLog {
  id: string;
  date: string;
  activity: string;
  impact: "positive" | "neutral" | "negative";
}

export interface WellnessLog {
  id: string;
  date: string;
  activity: string;
}

export interface Communication {
  id: string;
  date: string;
  task: string;
  completed: boolean;
}

export interface Entertainment {
  id: string;
  date: string;
  activity: string;
  completed: boolean;
}

export function filterByDate<T extends { date: string }>(items: T[], date: Date): T[] {
  const dateStr = format(date, "yyyy-MM-dd");
  return items.filter(item => item.date === dateStr);
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function getDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getCurrentDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}
