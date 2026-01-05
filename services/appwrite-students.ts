import { ID, Query } from "react-native-appwrite"
import { database } from "./appwrite"
import type { Student } from "@/interfaces/interface"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const STUDENTS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!

export const studentsService = {
  async addStudent(classId: string, student: Omit<Student, "id">): Promise<Student> {
    try {
      const response = await database.createDocument(DATABASE_ID, STUDENTS_COLLECTION_ID, ID.unique(), {
        ...student,
        classId,
        grades: student.grades ? JSON.stringify(student.grades) : JSON.stringify({}),
      })
      return this.mapDocumentToStudent(response as any)
    } catch (error) {
      throw new Error(`Failed to add student: ${error}`)
    }
  },

  async getStudentsByClass(classId: string): Promise<Student[]> {
    try {
      const response = await database.listDocuments(DATABASE_ID, STUDENTS_COLLECTION_ID, [
        Query.equal("classId", classId),
      ])
      return response.documents.map((doc) => this.mapDocumentToStudent(doc as any))
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error}`)
    }
  },

  async updateStudent(studentId: string, updates: Partial<Student>): Promise<Student> {
    try {
      const data: any = { ...updates }
      if (updates.grades) data.grades = JSON.stringify(updates.grades)

      const response = await database.updateDocument(DATABASE_ID, STUDENTS_COLLECTION_ID, studentId, data)
      return this.mapDocumentToStudent(response as any)
    } catch (error) {
      throw new Error(`Failed to update student: ${error}`)
    }
  },

  async deleteStudent(studentId: string): Promise<void> {
    try {
      await database.deleteDocument(DATABASE_ID, STUDENTS_COLLECTION_ID, studentId)
    } catch (error) {
      throw new Error(`Failed to delete student: ${error}`)
    }
  },

  mapDocumentToStudent(doc: any): Student {
    return {
      id: doc.$id,
      name: doc.name,
      avatar: doc.avatar,
      status: doc.status || "present",
      grades: doc.grades ? JSON.parse(doc.grades) : {},
    }
  },
}
