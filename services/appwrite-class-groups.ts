import { ID } from "react-native-appwrite"
import { database } from "./appwrite"
import type { ClassGroup } from "@/interfaces/interface"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const GROUPS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_GROUPS_COLLECTION_ID!

export const classGroupsService = {
  async createGroup(groupData: Omit<ClassGroup, "id" | "createdAt" | "updatedAt">): Promise<ClassGroup> {
    try {
      const now = new Date().toISOString()
      const response = await database.createDocument(DATABASE_ID, GROUPS_COLLECTION_ID, ID.unique(), {
        ...groupData,
        classIds: JSON.stringify(groupData.classIds),
        subGroupIds: JSON.stringify(groupData.subGroupIds),
        createdAt: now,
        updatedAt: now,
      })
      return this.mapDocumentToGroup(response as any)
    } catch (error) {
      throw new Error(`Failed to create class group: ${error}`)
    }
  },

  async getGroups(): Promise<ClassGroup[]> {
    try {
      const response = await database.listDocuments(DATABASE_ID, GROUPS_COLLECTION_ID)
      return response.documents.map((doc) => this.mapDocumentToGroup(doc as any))
    } catch (error) {
      throw new Error(`Failed to fetch class groups: ${error}`)
    }
  },

  async getGroupById(groupId: string): Promise<ClassGroup | null> {
    try {
      const response = await database.getDocument(DATABASE_ID, GROUPS_COLLECTION_ID, groupId)
      return this.mapDocumentToGroup(response as any)
    } catch (error) {
      console.error(`Failed to fetch group: ${error}`)
      return null
    }
  },

  async updateGroup(groupId: string, updates: Partial<ClassGroup>): Promise<ClassGroup> {
    try {
      const data: any = { ...updates, updatedAt: new Date().toISOString() }
      if (updates.classIds) data.classIds = JSON.stringify(updates.classIds)
      if (updates.subGroupIds) data.subGroupIds = JSON.stringify(updates.subGroupIds)

      const response = await database.updateDocument(DATABASE_ID, GROUPS_COLLECTION_ID, groupId, data)
      return this.mapDocumentToGroup(response as any)
    } catch (error) {
      throw new Error(`Failed to update class group: ${error}`)
    }
  },

  async deleteGroup(groupId: string): Promise<void> {
    try {
      await database.deleteDocument(DATABASE_ID, GROUPS_COLLECTION_ID, groupId)
    } catch (error) {
      throw new Error(`Failed to delete class group: ${error}`)
    }
  },

  mapDocumentToGroup(doc: any): ClassGroup {
    return {
      id: doc.$id,
      name: doc.name,
      description: doc.description,
      classIds: doc.classIds ? JSON.parse(doc.classIds) : [],
      subGroupIds: doc.subGroupIds ? JSON.parse(doc.subGroupIds) : [],
      parentGroupId: doc.parentGroupId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      icon: doc.icon,
      color: doc.color,
    }
  },
}
