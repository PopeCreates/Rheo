import type { Class, Assignment, StudentGrade } from "@/interfaces/interface"

export const calculateClassGradeStats = (classItem: Class, assignments: Assignment[], grades: StudentGrade[]) => {
  const classAssignments = assignments.filter((a) => a.classId === classItem.id)

  if (classAssignments.length === 0 || classItem.students.length === 0) {
    return {
      averageGrade: 0,
      highestGrade: 0,
      lowestGrade: 0,
      totalAssignments: 0,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
      studentGrades: [],
    }
  }

  const studentGrades = classItem.students.map((student) => {
    const studentGradeRecords = grades.filter(
      (g) => g.studentId === student.id && classAssignments.some((a) => a.id === g.assignmentId),
    )

    if (studentGradeRecords.length === 0) {
      return { studentId: student.id, studentName: student.name, overallGrade: 0, letterGrade: "N/A" }
    }

    const totalWeight = studentGradeRecords.reduce((sum, g) => sum + (g.overallGrade || 0), 0)
    const overallGrade = totalWeight / studentGradeRecords.length

    const letterGrade = getLetterGrade(overallGrade)

    return { studentId: student.id, studentName: student.name, overallGrade, letterGrade }
  })

  const validGrades = studentGrades.filter((g) => g.overallGrade > 0)

  if (validGrades.length === 0) {
    return {
      averageGrade: 0,
      highestGrade: 0,
      lowestGrade: 0,
      totalAssignments: classAssignments.length,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
      studentGrades,
    }
  }

  const averageGrade = validGrades.reduce((sum, g) => sum + g.overallGrade, 0) / validGrades.length
  const highestGrade = Math.max(...validGrades.map((g) => g.overallGrade))
  const lowestGrade = Math.min(...validGrades.map((g) => g.overallGrade))

  const gradeDistribution = validGrades.reduce(
    (acc, g) => {
      acc[g.letterGrade as keyof typeof acc]++
      return acc
    },
    { A: 0, B: 0, C: 0, D: 0, F: 0 },
  )

  return {
    averageGrade,
    highestGrade,
    lowestGrade,
    totalAssignments: classAssignments.length,
    gradeDistribution,
    studentGrades,
  }
}

export const getLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return "A"
  if (percentage >= 80) return "B"
  if (percentage >= 70) return "C"
  if (percentage >= 60) return "D"
  return "F"
}

export const getGradeColor = (letterGrade: string): string => {
  switch (letterGrade) {
    case "A":
      return "#10B981"
    case "B":
      return "#3B82F6"
    case "C":
      return "#F59E0B"
    case "D":
      return "#EF4444"
    case "F":
      return "#DC2626"
    default:
      return "#6B7280"
  }
}
