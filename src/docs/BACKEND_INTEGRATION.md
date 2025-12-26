# Backend Integration Guide for MARKMe

This guide will help you integrate a backend service like Firebase into your MARKMe React Native application.

## Current Architecture

MARKMe currently uses:
- **Local State Management**: React Context API (`contexts/AppContext.tsx`)
- **Local Storage**: AsyncStorage for data persistence (`utils/storage.ts`)
- **Mock Authentication**: No real authentication validation

### Data Structure

```typescript
// Current data stored locally
- userProfile: User profile information
- classes: Array of classes with students
- assignments: Array of assignments per class
- grades: Object mapping students to their grades
- attendanceRecords: Array of attendance records per class
- isAuthenticated: Boolean authentication state
```

---

## Firebase Integration

### Step 1: Install Firebase Dependencies

```bash
npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
```

### Step 2: Firebase Configuration

Create a new file `config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### Step 3: Firestore Database Structure

Recommended Firestore collection structure:

```
users/
  {userId}/
    - email: string
    - name: string
    - title: string
    - phone: string
    - avatar: string
    - createdAt: timestamp

classes/
  {classId}/
    - name: string
    - subject: string
    - code: string
    - schedule: string
    - color: string
    - userId: string (owner)
    - createdAt: timestamp
    - students: array of student IDs
    
students/
  {studentId}/
    - name: string
    - email: string
    - studentId: string
    - classId: string
    - avatar: string
    - createdAt: timestamp

assignments/
  {assignmentId}/
    - name: string
    - classId: string
    - userId: string
    - dueDate: timestamp
    - gradingCriteria: array
    - createdAt: timestamp

grades/
  {gradeId}/
    - studentId: string
    - assignmentId: string
    - classId: string
    - criteriaScores: object
    - overallGrade: number
    - letterGrade: string
    - comment: string
    - gradedAt: timestamp

attendance/
  {attendanceId}/
    - classId: string
    - date: timestamp
    - records: object { studentId: "present" | "absent" | "late" }
    - createdBy: string (userId)
```

### Step 4: Create Firebase Service Layer

Create `services/firebase/auth.service.ts`:

```typescript
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export const authService = {
  // Sign up new user
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  }
};
```

Create `services/firebase/firestore.service.ts`:

```typescript
import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import type { Class, Student, Assignment, GradeRecord, AttendanceRecord } from '@/interfaces/interface';

export const firestoreService = {
  // ===== CLASSES =====
  
  createClass: async (userId: string, classData: Omit<Class, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'classes'), {
        ...classData,
        userId,
        createdAt: Timestamp.now()
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getClasses: async (userId: string) => {
    try {
      const q = query(
        collection(db, 'classes'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const classes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Class[];
      return { success: true, data: classes };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateClass: async (classId: string, updates: Partial<Class>) => {
    try {
      await updateDoc(doc(db, 'classes', classId), updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  deleteClass: async (classId: string) => {
    try {
      // Delete class
      await deleteDoc(doc(db, 'classes', classId));
      
      // Also delete related data (students, assignments, grades, attendance)
      // You'll need to implement cascade deletion
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ===== STUDENTS =====
  
  addStudent: async (classId: string, studentData: Omit<Student, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'students'), {
        ...studentData,
        classId,
        createdAt: Timestamp.now()
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getStudentsByClass: async (classId: string) => {
    try {
      const q = query(
        collection(db, 'students'), 
        where('classId', '==', classId)
      );
      const snapshot = await getDocs(q);
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      return { success: true, data: students };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateStudent: async (studentId: string, updates: Partial<Student>) => {
    try {
      await updateDoc(doc(db, 'students', studentId), updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  deleteStudent: async (studentId: string) => {
    try {
      await deleteDoc(doc(db, 'students', studentId));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ===== ATTENDANCE =====
  
  saveAttendance: async (attendanceData: Omit<AttendanceRecord, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'attendance'), {
        ...attendanceData,
        date: Timestamp.now()
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getAttendanceByClass: async (classId: string) => {
    try {
      const q = query(
        collection(db, 'attendance'), 
        where('classId', '==', classId),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AttendanceRecord[];
      return { success: true, data: records };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ===== GRADES =====
  
  saveGrade: async (gradeData: Omit<GradeRecord, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'grades'), {
        ...gradeData,
        gradedAt: Timestamp.now()
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getGradesByAssignment: async (assignmentId: string) => {
    try {
      const q = query(
        collection(db, 'grades'), 
        where('assignmentId', '==', assignmentId)
      );
      const snapshot = await getDocs(q);
      const grades = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GradeRecord[];
      return { success: true, data: grades };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
```

### Step 5: Update AppContext to Use Firebase

Modify `contexts/AppContext.tsx`:

```typescript
import { authService } from '@/services/firebase/auth.service';
import { firestoreService } from '@/services/firebase/firestore.service';
import { useEffect, useState } from 'react';

// Replace AsyncStorage calls with Firestore calls
// Replace mock authentication with Firebase Auth

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user data from Firestore
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.success) {
      // Data will be loaded via auth state listener
      return { success: true };
    }
    return result;
  };

  const signup = async (email: string, password: string) => {
    const result = await authService.signUp(email, password);
    return result;
  };

  const logout = async () => {
    await authService.signOut();
    // Clear local state
  };

  // Replace all AsyncStorage operations with Firestore calls
  // Example: addClass
  const addClass = async (classData) => {
    const userId = user?.uid;
    if (!userId) return;
    
    const result = await firestoreService.createClass(userId, classData);
    if (result.success) {
      // Refresh classes list
      await loadClasses(userId);
    }
    return result;
  };

  // ... implement other methods similarly
};
```

### Step 6: Migration Checklist

- [ ] Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore Database
- [ ] Set up Firestore Security Rules
- [ ] Add Firebase config to your app
- [ ] Install Firebase packages
- [ ] Create service layer files
- [ ] Update AppContext to use Firebase services
- [ ] Update authentication screens to use real Firebase auth
- [ ] Test authentication flow
- [ ] Migrate existing AsyncStorage data to Firestore (if needed)
- [ ] Test all CRUD operations
- [ ] Implement offline persistence (Firestore has built-in support)
- [ ] Add error handling and loading states
- [ ] Set up Firebase Storage for images (avatars, etc.)

### Step 7: Firestore Security Rules

Add these rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own classes
    match /classes/{classId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can only access students in their classes
    match /students/{studentId} {
      allow read, write: if request.auth != null;
      // Add more specific rules based on classId ownership
    }
    
    // Similar rules for assignments, grades, attendance
    match /assignments/{assignmentId} {
      allow read, write: if request.auth != null;
    }
    
    match /grades/{gradeId} {
      allow read, write: if request.auth != null;
    }
    
    match /attendance/{attendanceId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Alternative: Supabase Integration

If you prefer Supabase over Firebase, here's a quick guide:

### Install Supabase

```bash
npm install @supabase/supabase-js
```

### Configure Supabase

```typescript
// config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Database Schema

Create tables in Supabase:

```sql
-- Users table (handled by Supabase Auth)

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  subject TEXT,
  code TEXT,
  schedule TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  student_id TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  due_date TIMESTAMP,
  grading_criteria JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grades table
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  criteria_scores JSONB,
  overall_grade NUMERIC,
  letter_grade TEXT,
  comment TEXT,
  graded_at TIMESTAMP DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  date TIMESTAMP DEFAULT NOW(),
  records JSONB,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own classes" ON classes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own classes" ON classes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own classes" ON classes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classes" ON classes
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

---

## Benefits of Moving to a Backend

1. **Real Authentication**: Secure user management with password recovery
2. **Multi-device Sync**: Access data from any device
3. **Data Backup**: Automatic cloud backups
4. **Scalability**: Handle larger datasets efficiently
5. **Real-time Updates**: Share classes with other teachers
6. **File Storage**: Store images and documents in cloud storage
7. **Analytics**: Track usage patterns
8. **Security**: Proper data protection with backend rules

---

## Important Notes

- **Keep AsyncStorage as Cache**: Even with a backend, use AsyncStorage for offline-first functionality
- **Handle Offline Mode**: Implement queue system for operations when offline
- **Loading States**: Add proper loading indicators for async operations
- **Error Handling**: Handle network errors gracefully
- **Data Migration**: If you have existing data, create a migration script

---

## Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Supabase Docs: https://supabase.com/docs
- React Native Firebase: https://rnfirebase.io
