import { Client, Databases, ID, Query } from "react-native-appwrite"

// Environment configuration
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!

// Initialize Appwrite client
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID)

// Initialize database instance
const database = new Databases(client)

export { client, database, DATABASE_ID, COLLECTION_ID }

export interface AttendanceRecord {
  user_id: string
  timestamp: string
  status: "present" | "absent" | "late"
  location?: string
  notes?: string
}

export const createAttendanceRecord = async (record: AttendanceRecord) => {
  try {
    const result = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      user_id: record.user_id,
      timestamp: record.timestamp,
      status: record.status,
      location: record.location || "",
      notes: record.notes || "",
    })
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Error creating attendance record:", error)
    return { success: false, error: error.message }
  }
}

export const getUserAttendance = async (userId: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("user_id", userId),
      Query.orderDesc("timestamp"),
      Query.limit(100),
    ])
    return { success: true, data: result.documents }
  } catch (error: any) {
    console.error("Error fetching attendance:", error)
    return { success: false, data: [], error: error.message }
  }
}

export const getAttendanceByDateRange = async (startDate: string, endDate: string, userId?: string) => {
  try {
    const queries = [
      Query.greaterThanEqual("timestamp", startDate),
      Query.lessThanEqual("timestamp", endDate),
      Query.orderDesc("timestamp"),
    ]

    if (userId) {
      queries.push(Query.equal("user_id", userId))
    }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, queries)
    return { success: true, data: result.documents }
  } catch (error: any) {
    console.error("Error fetching attendance by date:", error)
    return { success: false, data: [], error: error.message }
  }
}

export const updateAttendanceRecord = async (documentId: string, updates: Partial<AttendanceRecord>) => {
  try {
    const result = await database.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, updates)
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Error updating attendance:", error)
    return { success: false, error: error.message }
  }
}

export const deleteAttendanceRecord = async (documentId: string) => {
  try {
    await database.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId)
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting attendance:", error)
    return { success: false, error: error.message }
  }
}

export const getAttendanceStats = async (userId: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("user_id", userId),
      Query.limit(1000),
    ])

    const records = result.documents
    const stats = {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      attendanceRate:
        records.length > 0 ? (records.filter((r) => r.status === "present").length / records.length) * 100 : 0,
    }

    return { success: true, data: stats }
  } catch (error: any) {
    console.error("Error fetching attendance stats:", error)
    return {
      success: false,
      data: { total: 0, present: 0, absent: 0, late: 0, attendanceRate: 0 },
      error: error.message,
    }
  }
}
