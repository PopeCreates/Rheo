"use client"

import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "../../../contexts/AppContext"
import { ConfirmModal } from "../../../components/common/ConfirmModal"
import { EditClassModal } from "../../../components/modals/EditClassModal"
import { Toast } from "../../../components/common/Toast"
import { useToast } from "../../../hooks/useToast"
import type { Class } from "../../../interfaces/interface"

export default function ClassesScreen() {
  const router = useRouter()
  const { classes, deleteClass, updateClass } = useApp()
  const { toast, hide, success } = useToast()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null)

  const handleDeleteClass = () => {
    if (selectedClass) {
      deleteClass(selectedClass.id)
      setShowDeleteModal(false)
      setSelectedClass(null)
      setShowOptionsId(null)
      success("Class deleted successfully")
    }
  }

  const handleEditClass = (updates: Partial<Class>) => {
    if (selectedClass) {
      updateClass(selectedClass.id, updates)
      setShowEditModal(false)
      setSelectedClass(null)
      setShowOptionsId(null)
      success("Class updated successfully")
    }
  }

  return (
    <View className="flex-1 bg-dark">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Class"
        message={`Are you sure you want to delete ${selectedClass?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteClass}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedClass(null)
        }}
      />

      <EditClassModal
        visible={showEditModal}
        classItem={selectedClass}
        onSave={handleEditClass}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedClass(null)
        }}
      />

      <View className="flex-row justify-between items-center px-5 pt-15 pb-5">
        <View className="flex-row items-center gap-3">
          <Image source={{ uri: "https://i.pravatar.cc/100?img=5" }} className="w-10 h-10 rounded-full" />
          <Text className="text-2xl font-bold text-white">My Classes</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-lg font-semibold text-slate-400">Fall Semester 2023</Text>
          <View className="bg-dark-lighter px-3 py-1.5 rounded-full">
            <Text className="text-xs font-semibold text-primary">{classes.length} Active Classes</Text>
          </View>
        </View>

        {classes.map((classItem) => (
          <TouchableOpacity
            key={classItem.id}
            className="flex-row bg-dark-lighter rounded-2xl mb-4 overflow-hidden"
            onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
          >
            <View className="flex-1 p-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-1.5 bg-dark px-2.5 py-1.5 rounded-lg">
                  <Ionicons name="people" size={14} color="#94A3B8" />
                  <Text className="text-xs text-slate-400 font-semibold">{classItem.studentCount} Students</Text>
                </View>
                <View>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => setShowOptionsId(showOptionsId === classItem.id ? null : classItem.id)}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                  </TouchableOpacity>
                  {showOptionsId === classItem.id && (
                    <View className="absolute right-0 top-8 bg-dark-card rounded-xl overflow-hidden shadow-lg z-50 w-40">
                      <TouchableOpacity
                        className="flex-row items-center gap-3 px-4 py-3 border-b border-dark-border"
                        onPress={() => {
                          setSelectedClass(classItem)
                          setShowEditModal(true)
                        }}
                      >
                        <Ionicons name="create-outline" size={18} color="#0EA5E9" />
                        <Text className="text-white">Edit Class</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-row items-center gap-3 px-4 py-3"
                        onPress={() => {
                          setSelectedClass(classItem)
                          setShowDeleteModal(true)
                        }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        <Text className="text-red-500">Delete Class</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <Text className="text-2xl font-bold text-white mb-2">{classItem.name}</Text>
              <Text className="text-sm text-slate-400 mb-4">
                {classItem.time} • {classItem.room}
              </Text>
              <TouchableOpacity className="flex-row items-center gap-2 bg-dark px-4 py-2.5 rounded-lg self-start">
                <Text className="text-sm font-semibold text-primary">Manage Class</Text>
                <Ionicons name="arrow-forward" size={16} color="#0EA5E9" />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: classItem.image }} className="w-35 h-full" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-25 right-5 bg-primary flex-row items-center gap-2 py-4 px-6 rounded-full shadow-lg"
        onPress={() => router.push("/create-class")}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text className="text-base font-bold text-white">New Class</Text>
      </TouchableOpacity>
    </View>
  )
}
