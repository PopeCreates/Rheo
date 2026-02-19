import type { GradingCriterion } from "@/interfaces/interface"

export function calculateOverallGrade(scores: { [criterionId: string]: number }, criteria: GradingCriterion[]): number {
  let totalWeightedScore = 0
  let totalWeight = 0

  criteria.forEach((criterion) => {
    const score = scores[criterion.id]
    if (score !== undefined && score !== null) {
      const percentage = (score / criterion.maxScore) * 100
      totalWeightedScore += percentage * (criterion.weight / 100)
      totalWeight += criterion.weight
    }
  })

  return totalWeight > 0 ? totalWeightedScore / (totalWeight / 100) : 0
}

export function getLetterGrade(score: number): string {
  if (score >= 93) return "A"
  if (score >= 90) return "A-"
  if (score >= 87) return "B+"
  if (score >= 83) return "B"
  if (score >= 80) return "B-"
  if (score >= 77) return "C+"
  if (score >= 73) return "C"
  if (score >= 70) return "C-"
  if (score >= 67) return "D+"
  if (score >= 63) return "D"
  if (score >= 60) return "D-"
  return "F"
}

export function getGradeColor(score: number): string {
  if (score >= 90) return "#10b981" // success
  if (score >= 80) return "#3b82f6" // primary
  if (score >= 70) return "#f59e0b" // warning
  if (score >= 60) return "#f97316" // orange
  return "#ef4444" // error
}

export function validateScore(score: number, maxScore: number): boolean {
  return score >= 0 && score <= maxScore && !isNaN(score)
}
