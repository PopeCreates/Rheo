import type { CyclePhase } from "@/types/interface";

export function getCycleDay(lastPeriodDate: string, cycleLength: number): number {
  const start = new Date(lastPeriodDate);
  const today = new Date();
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % cycleLength) + 1;
}

export function getCyclePhase(cycleDay: number, cycleLength: number): CyclePhase {
  if (cycleDay <= 5) return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulation";
  if (cycleDay <= cycleLength - 3) return "luteal";
  return "late_luteal";
}

export function getPhaseLabel(phase: CyclePhase): string {
  switch (phase) {
    case "menstrual":
      return "Menstrual Phase";
    case "follicular":
      return "Follicular Phase";
    case "ovulation":
      return "Ovulation";
    case "luteal":
      return "Luteal Phase";
    case "late_luteal":
      return "Late Luteal";
  }
}

export function getDaysUntilPeriod(cycleDay: number, cycleLength: number): number {
  return cycleLength - cycleDay;
}

export function getCycleProgress(cycleDay: number, cycleLength: number): number {
  return Math.round((cycleDay / cycleLength) * 100);
}

export function getPhaseInsight(phase: CyclePhase): string {
  switch (phase) {
    case "menstrual":
      return "Take it easy today. Your body is doing important work. Rest and hydrate!";
    case "follicular":
      return "Estrogen levels are rising. You might notice a boost in energy and clearer skin today!";
    case "ovulation":
      return "You're at peak energy and fertility. Great time for social activities!";
    case "luteal":
      return "Progesterone is rising. You might start craving comfort foods.";
    case "late_luteal":
      return "Your period is approaching. Be gentle with yourself and prioritize self-care.";
  }
}

export function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

export function isPeriodDay(
  day: number,
  month: number,
  year: number,
  lastPeriodDate: string,
  cycleLength: number,
  periodLength: number = 5
): boolean {
  const date = new Date(year, month, day);
  const start = new Date(lastPeriodDate);
  const diffTime = date.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return false;
  const dayInCycle = (diffDays % cycleLength) + 1;
  return dayInCycle <= periodLength;
}

export function isFertileDay(
  day: number,
  month: number,
  year: number,
  lastPeriodDate: string,
  cycleLength: number
): boolean {
  const date = new Date(year, month, day);
  const start = new Date(lastPeriodDate);
  const diffTime = date.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return false;
  const dayInCycle = (diffDays % cycleLength) + 1;
  const ovulationDay = cycleLength - 14;
  return dayInCycle >= ovulationDay - 2 && dayInCycle <= ovulationDay + 2;
}

export function isOvulationDay(
  day: number,
  month: number,
  year: number,
  lastPeriodDate: string,
  cycleLength: number
): boolean {
  const date = new Date(year, month, day);
  const start = new Date(lastPeriodDate);
  const diffTime = date.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return false;
  const dayInCycle = (diffDays % cycleLength) + 1;
  const ovulationDay = cycleLength - 14;
  return dayInCycle === ovulationDay;
}

export function isPredictedPeriod(
  day: number,
  month: number,
  year: number,
  lastPeriodDate: string,
  cycleLength: number,
  periodLength: number = 5
): boolean {
  const date = new Date(year, month, day);
  const today = new Date();
  if (date <= today) return false;
  return isPeriodDay(day, month, year, lastPeriodDate, cycleLength, periodLength);
}
