"use client"

import { View, Text, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useApp } from "../../contexts/AppContext"
import { Header } from "../../components/common/Header"
import { Card } from "../../components/common/Card"
import { Ionicons } from "@expo/vector-icons"

export default function AttendanceHistoryScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classes, getAttendanceHistory, getAttendanceStats } = useApp()

  const classItem = classes.find((c) => c.id === id)
  const history = getAttendanceHistory(id as string)
  const stats = getAttendanceStats(id as string)

  if (!classItem) {
    return (
      <View className="flex-1 bg-dark justify-center items-center">
        <Text className="text-white">Class not found</Text>
      </View>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <View className="flex-1 bg-dark">
      <Header title="Attendance History" subtitle={classItem.name} showBack />

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Overall Stats Card */}
        <Card className="mb-4">
          <Text className="text-lg font-bold text-white mb-4">Overall Statistics</Text>
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400">Total Sessions</Text>
              <Text className="text-white font-bold text-lg">{stats.totalSessions}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400">Average Attendance</Text>
              <Text className="text-accent font-bold text-lg">{stats.averageAttendance.toFixed(1)}%</Text>
            </View>
          </View>
        </Card>

        {/* Student Attendance Stats */}
        <Card className="mb-4">
          <Text className="text-lg font-bold text-white mb-4">Student Statistics</Text>
          {stats.studentStats.map((stat) => {
            const student = classItem.students.find((s) => s.id === stat.studentId)
            if (!student) return null

            return (
              <View
                key={stat.studentId}
                className="flex-row justify-between items-center py-3 border-b border-gray-800"
              >
                <View className="flex-1">
                  <Text className="text-white font-medium">{student.name}</Text>
                  <Text className="text-gray-400 text-xs">
                    {stat.presentCount} present • {stat.absentCount} absent
                  </Text>
                </View>
                <View className="items-end">
                  <Text
                    className={`font-bold text-lg ${
                      stat.rate >= 90 ? "text-green-500" : stat.rate >= 75 ? "text-accent" : "text-red-500"
                    }`}
                  >
                    {stat.rate.toFixed(1)}%
                  </Text>
                </View>
              </View>
            )
          })}
        </Card>

        {/* Attendance History */}
        <Text className="text-xs font-bold text-gray-500 tracking-wider mb-4">ATTENDANCE HISTORY</Text>

        {history.length > 0 ? (
          history.map((record) => {
            const presentCount = record.studentRecords.filter((sr) => sr.status === "present").length
            const totalStudents = record.studentRecords.length
            const attendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0

            return (
              <Card key={record.id} className="mb-3">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar" size={20} color="#0EA5E9" />
                    <Text className="text-white font-semibold">{formatDate(record.date)}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-accent font-bold">{attendanceRate.toFixed(0)}%</Text>
                  </View>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text className="text-gray-400 text-sm">{presentCount} present</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                    <Text className="text-gray-400 text-sm">{totalStudents - presentCount} absent</Text>
                  </View>
                </View>
              </Card>
            )
          })
        ) : (
          <Card>
            <View className="items-center py-8">
              <Ionicons name="calendar-outline" size={48} color="#6B7280" />
              <Text className="text-gray-400 mt-4 text-center">
                No attendance history yet.{"\n"}Start taking attendance to see records here.
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  )
}
