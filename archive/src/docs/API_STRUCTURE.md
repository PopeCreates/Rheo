# MARKMe API Structure & Data Flow

This document outlines the current data structure and API patterns in MARKMe to help you understand how to integrate with a backend.

## Current Data Flow

```
User Action → Component → AppContext Method → AsyncStorage → State Update → UI Re-render
```

With Backend:
```
User Action → Component → AppContext Method → Firebase/Backend Service → State Update → UI Re-render
                                                      ↓
                                                 AsyncStorage (Cache)
```

## State Management Structure

### AppContext State

```typescript
interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  userProfile: UserProfile;
  
  // Classes
  classes: Class[];
  
  // Assignments
  assignments: Assignment[];
  
  // Grades
  grades: Record<string, Record<string, GradeRecord>>;
  
  // Attendance
  attendanceRecords: Record<string, AttendanceRecord[]>;
  
  // Methods
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  addClass: (classData: Omit<Class, 'id' | 'students'>) => void;
  updateClass: (classId: string, updates: Partial<Class>) => void;
  deleteClass: (classId: string) => void;
  
  addStudent: (classId: string, student: Omit<Student, 'id'>) => void;
  updateStudent: (classId: string, studentId: string, updates: Partial<Student>) => void;
  deleteStudent: (classId: string, studentId: string) => void;
  importStudentsFromCSV: (classId: string, students: Omit<Student, 'id'>[]) => void;
  
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (assignmentId: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (assignmentId: string) => void;
  
  saveGrade: (studentId: string, assignmentId: string, grade: Omit<GradeRecord, 'id' | 'studentId' | 'assignmentId'>) => void;
  
  saveAttendance: (classId: string, records: Record<string, AttendanceStatus>) => void;
}
```

## API Endpoints (Backend Implementation)

When you add a backend, you'll need these endpoints:

### Authentication
- `POST /auth/signup` - Create new user
- `POST /auth/login` - Authenticate user
- `POST /auth/logout` - Sign out user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile
- `POST /auth/reset-password` - Password reset

### Classes
- `GET /classes` - Get all classes for user
- `POST /classes` - Create new class
- `GET /classes/:id` - Get specific class with students
- `PUT /classes/:id` - Update class
- `DELETE /classes/:id` - Delete class

### Students
- `GET /classes/:classId/students` - Get students in class
- `POST /classes/:classId/students` - Add student to class
- `POST /classes/:classId/students/bulk` - Import multiple students
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Remove student

### Assignments
- `GET /assignments?classId=:classId` - Get assignments for class
- `POST /assignments` - Create assignment
- `GET /assignments/:id` - Get specific assignment
- `PUT /assignments/:id` - Update assignment
- `DELETE /assignments/:id` - Delete assignment

### Grades
- `GET /grades?assignmentId=:id` - Get grades for assignment
- `GET /grades?studentId=:id` - Get grades for student
- `POST /grades` - Save grade
- `PUT /grades/:id` - Update grade

### Attendance
- `GET /attendance?classId=:classId` - Get attendance records for class
- `POST /attendance` - Save attendance record
- `GET /attendance/:id` - Get specific attendance record

---

## Data Models Reference

See `interfaces/interface.d.ts` for complete type definitions.

### Key Models

**User Profile**
```typescript
interface UserProfile {
  name: string;
  email: string;
  title: string;
  phone: string;
  avatar: string;
}
```

**Class**
```typescript
interface Class {
  id: string;
  name: string;
  subject: string;
  code: string;
  schedule: string;
  color: string;
  students: Student[];
}
```

**Student**
```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar: string;
}
```

**Assignment**
```typescript
interface Assignment {
  id: string;
  name: string;
  classId: string;
  dueDate: string;
  gradingCriteria: GradingCriterion[];
}
```

**Grade Record**
```typescript
interface GradeRecord {
  id: string;
  studentId: string;
  assignmentId: string;
  criteriaScores: Record<string, number>;
  overallGrade: number;
  letterGrade: string;
  comment: string;
}
```

**Attendance Record**
```typescript
interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  records: Record<string, AttendanceStatus>;
}
```

---

## Migration Strategy

1. **Phase 1**: Set up backend infrastructure
2. **Phase 2**: Implement authentication
3. **Phase 3**: Migrate classes and students
4. **Phase 4**: Migrate assignments and grades
5. **Phase 5**: Migrate attendance records
6. **Phase 6**: Add real-time sync
7. **Phase 7**: Implement offline support

---

## Testing Checklist

- [ ] User registration and login
- [ ] Create, read, update, delete classes
- [ ] Add, edit, remove students
- [ ] CSV import functionality
- [ ] Create and manage assignments
- [ ] Grade entry and calculations
- [ ] Attendance tracking
- [ ] Profile management
- [ ] Image uploads (avatars)
- [ ] Data persistence across sessions
- [ ] Offline functionality
- [ ] Error handling
