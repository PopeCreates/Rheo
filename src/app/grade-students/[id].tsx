"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { Avatar } from "@/components/common/Avatar"
import { ManageCriteriaModal } from "@/components/modals/ManageCriteriaModal"
import { useToast } from "@/hooks/useToast"
import type { GradingCriterion } from "@/interfaces/interface"

export default function GradeStudentsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classes, updateGradingCriteria } = useApp()
  const { show } = useToast()

  const [editMode, setEditMode] = useState(true)
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([])
  const [studentGrades, setStudentGrades] = useState<{ [studentId: string]: { [criterionId: string]: number } }>({})

  const classItem = classes.find((c) => c.id === id)

  // Safe fallback for grading criteria
  const criteria: GradingCriterion[] =
    Array.isArray(classItem?.gradingCriteriaNew) && classItem.gradingCriteriaNew.length > 0
      ? (classItem.gradingCriteriaNew as GradingCriterion[])
      : [
          { id: "1", name: "Collaborative", weight: 30, maxScore: 100 },
          { id: "2", name: "Technical", weight: 40, maxScore: 100 },
          { id: "3", name: "English", weight: 30, maxScore: 100 },
        ]

  useEffect(() => {
    if (Array.isArray(classItem?.gradingCriteriaNew)) {
      const criteriaIds = classItem.gradingCriteriaNew.map((c) => c.id)
      setSelectedCriteria(criteriaIds.length > 0 ? [criteriaIds[0]] : [])
    }
  }, [classItem?.gradingCriteriaNew])

  const handleSaveCriteria = (newCriteria: GradingCriterion[]) => {
    if (!classItem?.id) return
    updateGradingCriteria(classItem.id, newCriteria)
    setShowCriteriaModal(false)
    show("Grading criteria updated", "success")
  }

  const toggleCriterion = (criterionId: string) => {
    setSelectedCriteria((prev) =>
      prev.includes(criterionId) ? prev.filter((id) => id !== criterionId) : [...prev, criterionId]
    )
  }

  // SINGLE CLAMPED UPDATE FUNCTION
  const updateStudentGrade = (studentId: string, criterionId: string, value: number) => {
    const clamped = Math.max(0, Math.min(100, value))
    setStudentGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [criterionId]: clamped,
      },
    }))
  }

  const incrementGrade = (studentId: string, criterionId: string) => {
    const current = studentGrades[studentId]?.[criterionId] ?? 0
    updateStudentGrade(studentId, criterionId, current + 1)
  }

  const decrementGrade = (studentId: string, criterionId: string) => {
    const current = studentGrades[studentId]?.[criterionId] ?? 0
    updateStudentGrade(studentId, criterionId, current - 1)
  }

  const isStudentGraded = (studentId: string) => {
    const grades = studentGrades[studentId]
    return grades && selectedCriteria.every((criterionId) => grades[criterionId] !== undefined)
  }

  const gradedCount = classItem?.students?.filter((s) => isStudentGraded(s.id)).length ?? 0

  const studentsSafe = Array.isArray(classItem?.students) ? classItem.students : []
  const selectedCriteriaSafe = Array.isArray(selectedCriteria) ? selectedCriteria : []

  if (!classItem) return null

  return (
    <View className="flex-1 bg-[#101c22]">
      {/* Header */}
      <View className="border-b border-[#325567]">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 items-center justify-center rounded-full will-change-pressable active:bg-[#192b33]"
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white flex-1 text-center">Grade Students</Text>
          <TouchableOpacity className="w-12 items-end">
            <Text className="text-sm font-bold text-[#92b7c9]">Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Edit Mode & Grading Criteria */}
        <View className="py-4 gap-4">
          <View className="flex-row items-center justify-between px-4">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-lg bg-[#233c48] items-center justify-center">
                <Ionicons name="create-outline" size={20} color="#13a4ec" />
              </View>
              <View>
                <Text className="text-base font-medium text-white">Edit Mode</Text>
                <Text className="text-xs text-[#94a3b8]">Enable to modify grades</Text>
              </View>
            </View>
            <Switch
              value={editMode}
              onValueChange={setEditMode}
              trackColor={{ false: "#233c48", true: "#13a4ec" }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="px-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Grading Criteria</Text>
              <TouchableOpacity
                onPress={() => setShowCriteriaModal(true)}
                className="flex-row items-center gap-1.5 bg-[#233c48] px-3 py-1.5 rounded-lg will-change-pressable active:bg-[#325567]"
              >
                <Text className="text-xs font-bold text-[#13a4ec]">Manage Criteria</Text>
                <Ionicons name="arrow-forward" size={14} color="#13a4ec" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-1">
              <View className="flex-row gap-3">
                {criteria.map((criterion) => {
                  if (!criterion?.id) return null
                  const isSelected = selectedCriteriaSafe.includes(criterion.id)
                  return (
                    <TouchableOpacity
                      key={criterion.id}
                      onPress={() => toggleCriterion(criterion.id)}
                      className={`h-8 flex-row items-center justify-center gap-2 px-4 rounded-full will-change-pressable ${
                        isSelected ? "bg-[#13a4ec]" : "bg-[#1a2730]"
                      }`}
                    >
                      <Text className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#94a3b8]"}`}>
                        {criterion.name ?? ""}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                    </TouchableOpacity>
                  )
                })}
                <TouchableOpacity
                  onPress={() => setShowCriteriaModal(true)}
                  className="h-8 flex-row items-center justify-center gap-1 px-3 rounded-full border border-dashed border-[#325567] will-change-pressable active:bg-[#192b33]"
                >
                  <Ionicons name="add" size={16} color="#13a4ec" />
                  <Text className="text-sm font-medium text-[#13a4ec]">Add</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="h-px bg-[#325567] mx-4 mb-4" />

        {/* Students & Grades */}
        <View className="px-4 gap-4">
          {studentsSafe.map((student) => {
            const isAbsent = student?.status === "absent"
            const isGraded = student?.id ? isStudentGraded(student.id) : false
            const studentId = student?.id ?? Math.random().toString() // Fallback key

            return (
              <View
                key={studentId}
                className={`bg-[#1c2a33] rounded-xl p-4 border border-[#325567] ${isAbsent ? "opacity-90" : ""}`}
              >
                {/* Student Header */}
                <View className="flex-row items-center gap-4 mb-4">
                  <View className={isAbsent ? "opacity-60 grayscale" : ""}>
                    <Avatar uri={student?.avatar ?? ""} name={student?.name ?? ""} size={48} />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className={`text-base font-bold ${isAbsent ? "text-[#6b7280]" : "text-white"}`}>
                      {student?.name ?? ""}
                    </Text>
                    <Text className={`text-xs ${isAbsent ? "text-[#6b7280]" : "text-[#94a3b8]"}`}>
                      ID: {student?.id ?? "-"} • {student?.status === "present" ? "Present" : "Absent"}
                    </Text>
                  </View>
                  <View>
                    {isAbsent ? (
                      <View className="flex-row items-center gap-1 bg-red-500/10 text-red-500 px-2 py-1 rounded">
                        <Ionicons name="close-circle" size={12} color="#ef4444" />
                        <Text className="text-xs font-bold text-red-500">Absent</Text>
                      </View>
                    ) : isGraded ? (
                      <View className="flex-row items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                        <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                        <Text className="text-xs font-bold text-green-500">Done</Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center gap-1 bg-[#1a2730] px-2 py-1 rounded">
                        <Ionicons name="time-outline" size={12} color="#6b7280" />
                        <Text className="text-xs font-bold text-[#6b7280]">Pending</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Grade Inputs */}
                {isAbsent ? (
                  <View className="bg-black/20 p-3 rounded-lg opacity-50">
                    <Text className="text-sm text-[#6b7280] italic text-center">Student absent - grading disabled</Text>
                  </View>
                ) : (
                  <View className="bg-black/20 p-3 rounded-lg gap-3">
                    {selectedCriteriaSafe.map((criterionId) => {
                      const criterion = criteria.find((c) => c.id === criterionId)
                      if (!criterion?.id) return null
                      const currentGrade = studentGrades[studentId]?.[criterionId] ?? 0

                      return (
                        <View key={criterionId} className="flex-row items-center justify-between gap-4">
                          <Text className="text-sm font-medium text-[#94a3b8] flex-1">{criterion.name ?? ""}</Text>
                          <View className="flex-row items-center gap-2">
                            <TouchableOpacity
                              onPress={() => decrementGrade(studentId, criterionId)}
                              disabled={!editMode}
                              className="w-8 h-8 rounded-lg bg-[#233c48] items-center justify-center border border-[#325567] will-change-pressable active:bg-[#192b33]"
                            >
                              <Ionicons name="remove" size={16} color="#6b7280" />
                            </TouchableOpacity>
                            <View className="w-20">
                              <TextInput
                                value={currentGrade.toString()}
                                onChangeText={(text) => {
                                  const num = Number.parseInt(text) || 0
                                  updateStudentGrade(studentId, criterionId, num)
                                }}
                                keyboardType="numeric"
                                editable={editMode}
                                placeholder="-"
                                placeholderTextColor="#6b7280"
                                className="w-full text-center bg-[#233c48] border border-[#325567] rounded-lg text-sm font-bold text-white py-1.5"
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => incrementGrade(studentId, criterionId)}
                              disabled={!editMode}
                              className="w-8 h-8 rounded-lg bg-[#233c48] items-center justify-center border border-[#325567] will-change-pressable active:bg-[#192b33]"
                            >
                              <Ionicons name="add" size={16} color="#6b7280" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="bg-[#101c22] border-t border-[#325567] px-4 py-4 pb-6 shadow-[0_-5px_10px_rgba(0,0,0,0.1)]">
        <View className="flex-row justify-between items-center mb-3 px-1">
          <Text className="text-xs text-[#94a3b8]">
            {gradedCount}/{studentsSafe.length} Students Graded
          </Text>
          <TouchableOpacity onPress={() => setStudentGrades({})}>
            <Text className="text-xs font-medium text-[#13a4ec]">Clear All</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            show("Grades saved successfully", "success")
            router.back()
          }}
          className="w-full bg-[#13a4ec] h-12 rounded-xl items-center justify-center flex-row gap-2 will-change-pressable active:bg-[#0b8acb]"
        >
          <Ionicons name="save-outline" size={20} color="#ffffff" />
          <Text className="text-base font-bold text-white">Save Grades</Text>
        </TouchableOpacity>
      </View>

      <ManageCriteriaModal
        visible={showCriteriaModal}
        classId={classItem.id}
        criteria={criteria}
        onSave={handleSaveCriteria}
        onCancel={() => setShowCriteriaModal(false)}
      />
    </View>
  )
}
