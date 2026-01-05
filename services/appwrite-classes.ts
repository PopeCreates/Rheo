import { ID, Query } from "react-native-appwrite"
import { database } from "./appwrite"
import type { Class } from "@/interfaces/interface"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const CLASSES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CLASSES_COLLECTION_ID!

export const classesService = {
  async createClass(classData: Omit<Class, "id">): Promise<Class> {
    try {
      const response = await database.createDocument(DATABASE_ID, CLASSES_COLLECTION_ID, ID.unique(), {
        ...classData,
        students: JSON.stringify(classData.students || []),
        gradingCriteria: JSON.stringify(classData.gradingCriteria || []),
        assignments: JSON.stringify(classData.assignments || []),
      })
      return this.mapDocumentToClass(response)
    } catch (error) {
      throw new Error(`Failed to create class: ${error}`)
    }
  },

  async getClasses(): Promise<Class[]> {
    try {
      const response = await database.listDocuments(DATABASE_ID, CLASSES_COLLECTION_ID)
      return response.documents.map((doc) => this.mapDocumentToClass(doc))
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${error}`)
    }
  },

  async getClassById(classId: string): Promise<Class | null> {
    try {
      const response = await database.getDocument(DATABASE_ID, CLASSES_COLLECTION_ID, classId)
      return this.mapDocumentToClass(response)
    } catch (error) {
      console.error(`Failed to fetch class: ${error}`)
      return null
    }
  },

  async updateClass(classId: string, updates: Partial<Class>): Promise<Class> {
    try {
      const data: any = { ...updates }
      if (updates.students) data.students = JSON.stringify(updates.students)
      if (updates.gradingCriteria) data.gradingCriteria = JSON.stringify(updates.gradingCriteria)
      if (updates.assignments) data.assignments = JSON.stringify(updates.assignments)

      const response = await database.updateDocument(DATABASE_ID, CLASSES_COLLECTION_ID, classId, data)
      return this.mapDocumentToClass(response)
    } catch (error) {
      throw new Error(`Failed to update class: ${error}`)
    }
  },

  async deleteClass(classId: string): Promise<void> {
    try {
      await database.deleteDocument(DATABASE_ID, CLASSES_COLLECTION_ID, classId)
    } catch (error) {
      throw new Error(`Failed to delete class: ${error}`)
    }
  },

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    try {
      const response = await database.listDocuments(DATABASE_ID, CLASSES_COLLECTION_ID, [
        Query.equal("teacherId", teacherId),
      ])
      return response.documents.map((doc) => this.mapDocumentToClass(doc))
    } catch (error) {
      throw new Error(`Failed to fetch teacher's classes: ${error}`)
    }
  },

  mapDocumentToClass(doc: any): Class {
    return {
      id: doc.$id,
      name: doc.name,
      subject: doc.subject,
      section: doc.section,
      time: doc.time,
      room: doc.room,
      studentCount: doc.studentCount,
      image: doc.image,
      semester: doc.semester,
      students: doc.students ? JSON.parse(doc.students) : [],
      gradingCriteria: doc.gradingCriteria ? JSON.parse(doc.gradingCriteria) : [],
      assignments: doc.assignments ? JSON.parse(doc.assignments) : [],
      parentGroupId: doc.parentGroupId,
    }
  },
}
