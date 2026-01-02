"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useLocalSearchParams, useRouter, Stack } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { calculateClassGradeStats } from "@/utils/gradeAnalytics"
import { useState } from "react"
import { LinearGradient } from "expo-linear-gradient"

// NEW: Advanced analytics detail screen for a specific class
// Shows comprehensive grading insights including performance trends and student breakdown
export default function ClassAnalyticsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { classes, assignments, grades } = useApp()

  // NEW: Filter options for analytics view
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days")
  const [selectedAssignment, setSelectedAssignment] = useState("All Assignments")
  const [selectedStudent, setSelectedStudent] = useState("All Students")

  // NEW: Find the current class
  const classItem = classes.find((c) => c.id === id)

  if (!classItem) {
    return (
      <View className="flex-1 bg-[#101c22] items-center justify-center">
        <Text className="text-white">Class not found</Text>
      </View>
    )
  }

  // NEW: Calculate comprehensive statistics
  const stats = calculateClassGradeStats(classItem, assignments, grades)

  // NEW: Mock trend data (in production, calculate from actual grade history)
  const trendData = [
    { month: "Sep", value: 82 },
    { month: "Oct", value: 79 },
    { month: "Nov", value: 85 },
    { month: "Dec", value: 84 },
  ]

  // NEW: Get top performing students
  const topStudents = [...stats.studentGrades]
    .filter((s) => s.overallGrade > 0)
    .sort((a, b) => b.overallGrade - a.overallGrade)
    .slice(0, 4)

  // NEW: Helper to get letter grade from percentage
  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  // NEW: Helper to get grade color based on letter grade
  const getGradeColor = (letterGrade: string): string => {
    if (letterGrade === "A" || letterGrade === "B") return "#10B981"
    if (letterGrade === "C") return "#F59E0B"
    if (letterGrade === "D") return "#EF4444"
    return "#DC2626"
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: classItem.name,
          headerStyle: { backgroundColor: "#101c22" },
          headerTintColor: "#fff",
          headerRight: () => (
            <TouchableOpacity className="p-2">
              <Ionicons name="share-outline" size={24} color="#13a4ec" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-[#101c22]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* NEW: Filter chips section */}
          <View className="px-4 py-3 border-b border-[#1c2a33]">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
              <TouchableOpacity className="flex-row items-center gap-2 bg-[#13a4ec] rounded-full px-4 py-2">
                <Text className="text-white text-sm font-medium">{selectedPeriod}</Text>
                <Ionicons name="chevron-down" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-2 bg-[#1c2a33] border border-[#325567] rounded-full px-4 py-2">
                <Text className="text-[#b0bccc] text-sm font-medium">{selectedAssignment}</Text>
                <Ionicons name="chevron-down" size={16} color="#637588" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-2 bg-[#1c2a33] border border-[#325567] rounded-full px-4 py-2">
                <Text className="text-[#b0bccc] text-sm font-medium">{selectedStudent}</Text>
                <Ionicons name="chevron-down" size={16} color="#637588" />
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View className="p-4">
            {/* NEW: Summary stats cards */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-[#1c2a33] border border-[#325567] rounded-xl p-4">
                <Text className="text-[#637588] text-xs font-medium uppercase tracking-wider mb-2">Avg</Text>
                <Text className="text-white text-2xl font-bold mb-1">{stats.averageGrade.toFixed(0)}%</Text>
                <View className="flex-row items-center">
                  <Ionicons name="trending-up" size={14} color="#10B981" />
                  <Text className="text-[#10B981] text-xs font-medium ml-1">2.1%</Text>
                </View>
              </View>
              <View className="flex-1 bg-[#1c2a33] border border-[#325567] rounded-xl p-4">
                <Text className="text-[#637588] text-xs font-medium uppercase tracking-wider mb-2">High</Text>
                <Text className="text-white text-2xl font-bold mb-1">{stats.highestGrade.toFixed(0)}%</Text>
                <View className="flex-row items-center">
                  <Ionicons name="trending-down" size={14} color="#EF4444" />
                  <Text className="text-[#EF4444] text-xs font-medium ml-1">0.5%</Text>
                </View>
              </View>
              <View className="flex-1 bg-[#1c2a33] border border-[#325567] rounded-xl p-4">
                <Text className="text-[#637588] text-xs font-medium uppercase tracking-wider mb-2">Low</Text>
                <Text className="text-white text-2xl font-bold mb-1">{stats.lowestGrade.toFixed(0)}%</Text>
                <View className="flex-row items-center">
                  <Ionicons name="trending-up" size={14} color="#10B981" />
                  <Text className="text-[#10B981] text-xs font-medium ml-1">4.0%</Text>
                </View>
              </View>
            </View>

            {/* NEW: Performance Trend Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-bold">Performance Trend</Text>
                <TouchableOpacity>
                  <Text className="text-[#13a4ec] text-sm font-medium">View Details</Text>
                </TouchableOpacity>
              </View>
              <View className="bg-[#1c2a33] border border-[#325567] rounded-xl p-5">
                <View className="mb-6">
                  <Text className="text-[#637588] text-sm mb-1">Semester Average</Text>
                  <View className="flex-row items-baseline gap-2">
                    <Text className="text-white text-3xl font-bold">{stats.averageGrade.toFixed(0)}%</Text>
                    <Text className="text-[#637588] text-sm">Sept - Dec</Text>
                  </View>
                </View>
                {/* NEW: Simplified trend visualization */}
                <View className="h-32 flex-row items-end justify-between gap-1 mb-4">
                  {trendData.map((point, index) => (
                    <View key={index} className="flex-1 items-center">
                      <View
                        className="w-full bg-[#13a4ec]/20 rounded-t-lg overflow-hidden"
                        style={{ height: `${(point.value / 100) * 100}%` }}
                      >
                        <LinearGradient
                          colors={["#13a4ec", "#13a4ec80"]}
                          className="w-full h-full"
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
                <View className="flex-row justify-between">
                  {trendData.map((point) => (
                    <Text key={point.month} className="text-[#637588] text-xs font-bold uppercase">
                      {point.month}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* NEW: Grade Distribution Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-bold">Grade Distribution</Text>
              </View>
              <View className="bg-[#1c2a33] border border-[#325567] rounded-xl p-5">
                <View className="flex-row items-end justify-between h-40 gap-2">
                  {Object.entries(stats.gradeDistribution).map(([grade, count]) => {
                    const maxCount = Math.max(...Object.values(stats.gradeDistribution))
                    const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0
                    const barColor = grade === "A" || grade === "B" ? "#13a4ec" : grade === "F" ? "#EF4444" : "#637588"

                    return (
                      <View key={grade} className="flex-1 items-center gap-2">
                        <Text className="text-[#637588] text-xs font-bold opacity-0">{count}</Text>
                        <View className="w-full bg-[#13a4ec]/10 rounded-t-md" style={{ height: `${heightPercent}%` }}>
                          <View className="w-full rounded-t-md" style={{ height: "100%", backgroundColor: barColor }} />
                        </View>
                        <Text className="text-white text-sm font-bold">{grade}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>

            {/* NEW: Student Performance Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-bold">Student Performance</Text>
                <TouchableOpacity onPress={() => router.push(`/grade-students/${id}`)}>
                  <Text className="text-[#13a4ec] text-sm font-medium">See All</Text>
                </TouchableOpacity>
              </View>
              <View className="bg-[#1c2a33] border border-[#325567] rounded-xl overflow-hidden">
                {topStudents.length > 0 ? (
                  topStudents.map((studentGrade, index) => {
                    const student = classItem.students.find((s) => s.id === studentGrade.studentId)
                    if (!student) return null

                    const letterGrade = getLetterGrade(studentGrade.overallGrade)
                    const gradeColor = getGradeColor(letterGrade)

                    return (
                      <TouchableOpacity
                        key={student.id}
                        className={`flex-row items-center justify-between p-4 ${index < topStudents.length - 1 ? "border-b border-[#325567]" : ""}`}
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className="w-10 h-10 bg-[#13a4ec]/20 rounded-full items-center justify-center">
                            <Text className="text-[#13a4ec] font-bold text-sm">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-white text-sm font-bold">{student.name}</Text>
                            <Text className="text-[#637588] text-xs">{stats.totalAssignments} submitted</Text>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-3">
                          <View className="items-end">
                            <Text className="text-sm font-bold" style={{ color: gradeColor }}>
                              {studentGrade.overallGrade.toFixed(0)}%
                            </Text>
                            <Text className="text-[#637588] text-xs font-medium">Grade {letterGrade}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color="#637588" />
                        </View>
                      </TouchableOpacity>
                    )
                  })
                ) : (
                  <View className="p-4">
                    <Text className="text-[#637588] text-sm">No grades recorded yet</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  )
}
