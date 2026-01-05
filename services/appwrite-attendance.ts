import { Client, Databases, ID, Query } from "react-native-appwrite"

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

const databases = new Databases(client)

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ""
const ATTENDANCE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_ATTENDANCE_COLLECTION_ID || ""

interface AttendanceRecord {
  classId: string
  studentId: string
  date: string
  status: "present" | "absent" | "late"
  notes?: string
}

export const attendanceService = {
  // Save attendance record
  async saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
    try {
      console.log("[v0] Saving attendance record")

      await databases.createDocument(DATABASE_ID, ATTENDANCE_COLLECTION_ID, ID.unique(), {
        classId: record.classId,
        studentId: record.studentId,
        date: record.date,
        status: record.status,
        notes: record.notes,
        createdAt: new Date().toISOString(),
      })

      console.log("[v0] Attendance record saved")
    } catch (error: any) {
      console.error("[v0] Save attendance error:", error)
      throw new Error(error.message || "Failed to save attendance")
    }
  },

  // Get attendance for a class on a date
  async getAttendanceForDate(classId: string, date: string): Promise<AttendanceRecord[]> {
    try {
      const documents = await databases.listDocuments(DATABASE_ID, ATTENDANCE_COLLECTION_ID, [
        Query.equal("classId", classId),
        Query.equal("date", date),
      ])

      return documents.documents.map((doc: any) => ({
        classId: doc.classId,
        studentId: doc.studentId,
        date: doc.date,
        status: doc.status,
        notes: doc.notes,
      }))
    } catch (error: any) {
      console.error("[v0] Get attendance error:", error)
      return []
    }
  },

  // Get attendance history for a student
  async getStudentAttendanceHistory(studentId: string, classId: string): Promise<AttendanceRecord[]> {
    try {
      const documents = await databases.listDocuments(DATABASE_ID, ATTENDANCE_COLLECTION_ID, [
        Query.equal("studentId", studentId),
        Query.equal("classId", classId),
      ])

      return documents.documents.map((doc: any) => ({
        classId: doc.classId,
        studentId: doc.studentId,
        date: doc.date,
        status: doc.status,
        notes: doc.notes,
      }))
    } catch (error: any) {
      console.error("[v0] Get history error:", error)
      return []
    }
  },
}
