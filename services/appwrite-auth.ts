import { Client, Account, Databases, ID } from "react-native-appwrite"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)
const databases = new Databases(client)

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ""
const USERS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID || ""

interface TeacherData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface TeacherProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  title?: string
  phone?: string
  avatar?: string
  createdAt: string
}

export const appwriteAuth = {
  // Sign up new teacher account
  async signUp(data: TeacherData): Promise<{ userId: string; email: string }> {
    try {
      console.log("Starting teacher signup for:", data.email)

      // Create user in Appwrite Auth
      const user = await account.create(ID.unique(), data.email, data.password, `${data.firstName} ${data.lastName}`)

      // Create user profile in database
      await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
        userId: user.$id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: "teacher",
        createdAt: new Date().toISOString(),
      })

      console.log("Teacher signup successful:", user.$id)
      return { userId: user.$id, email: user.email }
    } catch (error: any) {
      console.error("Signup error:", error)
      throw new Error(error.message || "Signup failed")
    }
  },

  // Login teacher
  async login(email: string, password: string): Promise<{ userId: string; email: string }> {
    try {
      console.log("Starting login for:", email)

      const session = await account.createEmailPasswordSession(email, password)

      console.log("Login successful:", session.userId)
      return { userId: session.userId, email: email }
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.message || "Invalid email or password")
    }
  },

  // Get current logged-in user
  async getCurrentUser(): Promise<TeacherProfile | null> {
    try {
      const user = await account.get()

      // Fetch user profile from database
      const profileDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id)

      return {
        id: profileDoc.userId,
        firstName: profileDoc.firstName,
        lastName: profileDoc.lastName,
        email: profileDoc.email,
        title: profileDoc.title,
        phone: profileDoc.phone,
        avatar: profileDoc.avatar,
        createdAt: profileDoc.createdAt,
      }
    } catch (error) {
      console.log("No active session")
      return null
    }
  },

  // Logout teacher
  async logout(): Promise<void> {
    try {
      await account.deleteSession("current")
      console.log("Logout successful")
    } catch (error: any) {
      console.error("Logout error:", error)
    }
  },

  // Update teacher profile
  async updateProfile(userId: string, updates: Partial<TeacherProfile>): Promise<void> {
    try {
      await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, updates)
      console.log("Profile updated")
    } catch (error: any) {
      console.error("Update profile error:", error)
      throw new Error(error.message || "Failed to update profile")
    }
  },

  // Check if session exists
  async isSessionActive(): Promise<boolean> {
    try {
      await account.get()
      return true
    } catch {
      return false
    }
  },
}
