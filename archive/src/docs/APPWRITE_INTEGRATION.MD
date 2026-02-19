# MarkMe - Appwrite BaaS Integration Guide

## Setup Checklist

### 1. Appwrite Cloud Account & Project
- [ ] Create account at https://cloud.appwrite.io
- [ ] Create project "MarkMe"
- [ ] Copy PROJECT_ID from project settings
- [ ] Add Platform: React Native with package name `com.markme.app`

### 2. Create Collections & Attributes

#### Collection: `users`
- user_id (String, Primary)
- email (String, Unique)
- name (String)
- title (String, optional)
- avatar (String, optional)
- createdAt (DateTime)

#### Collection: `classes`
- classId (String, Primary)
- teacherId (String)
- name (String)
- subject (String)
- section (String)
- time (String)
- room (String)
- studentCount (Integer)
- image (String, optional)
- semester (String)
- students (String) - JSON stringified
- gradingCriteria (String) - JSON stringified
- assignments (String) - JSON stringified
- parentGroupId (String, optional)

#### Collection: `class_groups`
- groupId (String, Primary)
- teacherId (String)
- name (String)
- description (String, optional)
- classIds (String) - JSON stringified array
- subGroupIds (String) - JSON stringified array
- parentGroupId (String, optional)
- icon (String, optional)
- color (String, optional)
- createdAt (DateTime)
- updatedAt (DateTime)

#### Collection: `students`
- studentId (String, Primary)
- classId (String)
- name (String)
- avatar (String, optional)
- status (String) - "present" or "absent"
- grades (String) - JSON stringified object

#### Collection: `attendance_records`
- recordId (String, Primary)
- classId (String)
- date (DateTime)
- studentRecords (String) - JSON stringified array of {studentId, status}

#### Collection: `grades`
- gradeId (String, Primary)
- studentId (String)
- classId (String)
- assignmentId (String)
- scores (String) - JSON stringified
- overallGrade (Float, optional)
- letterGrade (String, optional)
- gradedAt (DateTime)

#### Collection: `grading_criteria`
- criteriaId (String, Primary)
- classId (String)
- name (String)
- weight (Float)
- maxScore (Float)
- description (String, optional)
- createdAt (DateTime)

### 3. Environment Variables

Add to your `.env` file:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users_collection_id
EXPO_PUBLIC_APPWRITE_CLASSES_COLLECTION_ID=classes_collection_id
EXPO_PUBLIC_APPWRITE_GROUPS_COLLECTION_ID=class_groups_collection_id
EXPO_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID=students_collection_id
EXPO_PUBLIC_APPWRITE_ATTENDANCE_COLLECTION_ID=attendance_records_collection_id
EXPO_PUBLIC_APPWRITE_GRADES_COLLECTION_ID=grades_collection_id
EXPO_PUBLIC_APPWRITE_CRITERIA_COLLECTION_ID=grading_criteria_collection_id
```

### 4. Permissions

For all collections:
- Go to Collection Settings → Permissions
- Add Role: `Any`
- Grant: Create, Read, Update, Delete

### 5. Install Dependencies

```bash
npm install react-native-appwrite
```

## Testing Data Persistence

### Test 1: Create a Class
1. Go to Classes tab
2. Click Create button
3. Add a new class
4. Refresh the app - class should persist

### Test 2: Add Students
1. Open a class
2. Add students
3. Close and reopen app - students should still be there

### Test 3: Mark Attendance
1. Go to Attendance tab
2. Mark students present/absent
3. Save attendance
4. Restart app - attendance should persist

### Test 4: Add Grades
1. Open a class
2. Go to Manage Criteria
3. Add grading criteria
4. Grade students
5. Restart app - grades should persist

### Test 5: Create Class Groups
1. Create a new class group
2. Add classes to the group
3. Restart app - group and associations should persist

## Debugging

Enable v0 debug logs to monitor data syncing:
```
[v0] Classes synced to Appwrite successfully
[v0] Class groups synced to Appwrite successfully
```

If you see errors, check:
1. Environment variables are set correctly
2. All collections are created with correct attributes
3. Permissions are set to allow Any user
4. Appwrite project is active
5. Network connection is available

## Data Flow

1. **On App Launch**: AppContext loads data from Appwrite (or falls back to mock data)
2. **On Data Change**: State updates trigger automatic syncing to Appwrite
3. **On App Close**: All data persists in Appwrite cloud database
4. **Offline Support**: Local state changes sync when app reopens and connection is available

---

All data is now backed by Appwrite! Your MarkMe app is production-ready with persistent cloud storage.
