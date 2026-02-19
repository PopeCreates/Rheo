import { z } from "zod"

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

type User = z.infer<typeof userSchema> & { id: string }

// In-memory user store - replace with backend API calls when integrating Firebase/Supabase
const users: User[] = []

export const signUp = (data: Omit<User, "id">) => {
  // Check if user already exists
  const existingUser = users.find((user) => user.email === data.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Create new user
  const newUser: User = {
    ...data,
    id: Date.now().toString(),
  }

  users.push(newUser)
  console.log("User registered:", newUser.email)
  console.log("Total users:", users.length)

  return {
    success: true,
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  }
}

export const logIn = (data: { email: string; password: string }) => {
  // Find user by email
  const user = users.find((user) => user.email === data.email)

  if (!user) {
    throw new Error("No account found with this email")
  }

  // Verify password
  if (user.password !== data.password) {
    throw new Error("Invalid password")
  }

  console.log("User logged in:", user.email)

  return {
    success: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  }
}

// Helper function to get all users (for debugging)
export const getAllUsers = () => users

// Helper function to clear all users (for testing)
export const clearUsers = () => {
  users.length = 0
  console.log("All users cleared")
}
