import { Client, Databases, ID, Query } from "react-native-appwrite"

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

const databases = new Databases(client)

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ""
const GRADES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_GRADES_COLLECTION_ID || ""
const CRITERIA_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CRITERIA_COLLECTION_ID || ""

interface Grade {
  studentId: string
  classId: string
  assignmentId: string
  score: number
  maxScore: number
  criteriaBreakdown?: Record<string, number>
  gradedDate: string
}

interface GradingCriteria {
  classId: string
  name: string
  description?: string
  maxPoints: number
  weight?: number
}

export const appwriteGrades = {
  // Save grade (0-100 scale)
  async saveGrade(grade: Grade): Promise<void> {
    try {
      console.log("Saving grade for student:", grade.studentId)

      await databases.createDocument(DATABASE_ID, GRADES_COLLECTION_ID, ID.unique(), {
        studentId: grade.studentId,
        classId: grade.classId,
        assignmentId: grade.assignmentId,
        score: grade.score,
        maxScore: grade.maxScore,
        criteriaBreakdown: JSON.stringify(grade.criteriaBreakdown || {}),
        gradedDate: grade.gradedDate,
        createdAt: new Date().toISOString(),
      })

      console.log("Grade saved successfully")
    } catch (error: any) {
      console.error("Save grade error:", error)
      throw new Error(error.message || "Failed to save grade")
    }
  },

  // Get grades for a student in a class
  async getStudentGrades(studentId: string, classId: string): Promise<Grade[]> {
    try {
      const documents = await databases.listDocuments(DATABASE_ID, GRADES_COLLECTION_ID, [
        Query.equal("studentId", studentId),
        Query.equal("classId", classId),
      ])

      return documents.documents.map((doc: any) => ({
        studentId: doc.studentId,
        classId: doc.classId,
        assignmentId: doc.assignmentId,
        score: doc.score,
        maxScore: doc.maxScore,
        criteriaBreakdown: doc.criteriaBreakdown ? JSON.parse(doc.criteriaBreakdown) : {},
        gradedDate: doc.gradedDate,
      }))
    } catch (error: any) {
      console.error("Get grades error:", error)
      return []
    }
  },

  // Create grading criteria for a class
  async createCriteria(classId: string, criteria: GradingCriteria): Promise<void> {
    try {
      console.log("[v0] Creating criteria for class:", classId)

      await databases.createDocument(DATABASE_ID, CRITERIA_COLLECTION_ID, ID.unique(), {
        classId,
        name: criteria.name,
        description: criteria.description,
        maxPoints: criteria.maxPoints,
        weight: criteria.weight,
        createdAt: new Date().toISOString(),
      })

      console.log("Criteria created successfully")
    } catch (error: any) {
      console.error("Create criteria error:", error)
      throw new Error(error.message || "Failed to create criteria")
    }
  },

  // Get criteria for a class
  async getClassCriteria(classId: string): Promise<GradingCriteria[]> {
    try {
      const documents = await databases.listDocuments(DATABASE_ID, CRITERIA_COLLECTION_ID, [
        Query.equal("classId", classId),
      ])

      return documents.documents.map((doc: any) => ({
        classId: doc.classId,
        name: doc.name,
        description: doc.description,
        maxPoints: doc.maxPoints,
        weight: doc.weight,
      }))
    } catch (error: any) {
      console.error("Get criteria error:", error)
      return []
    }
  },

  // Calculate average grade for a student in a class (0-100)
  async getStudentAverageGrade(studentId: string, classId: string): Promise<number> {
    try {
      const grades = await this.getStudentGrades(studentId, classId)

      if (grades.length === 0) return 0

      const totalPercentage = grades.reduce((sum, grade) => {
        const percentage = (grade.score / grade.maxScore) * 100
        return sum + percentage
      }, 0)

      const average = totalPercentage / grades.length
      return Math.round(average * 10) / 10
    } catch (error: any) {
      console.error("[v0] Calculate average error:", error)
      return 0
    }
  },
}
