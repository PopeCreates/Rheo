import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Avatar } from "@/components/common/Avatar"
import type { StudentCardProps } from "../../interfaces/interface"

export function StudentCard({
  student,
  onToggleStatus,
  showAttendance = true,
  onEdit,
  onDelete,
  showActions = false,
}: StudentCardProps) {
  return (
    <View className="flex-row justify-between items-center bg-dark-card p-4 rounded-xl mb-3">
      <View className="flex-row items-center gap-3 flex-1">
        <Avatar uri={student.avatar} name={student.name} size={48} />
        <View className="flex-1">
          <Text className="text-white text-base font-semibold">{student.name}</Text>
          <Text className="text-gray-500 text-xs">ID: {student.id}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {showAttendance && (
          <TouchableOpacity
            onPress={onToggleStatus}
            className={`px-4 py-2 rounded-full ${student.status === "present" ? "bg-primary" : "bg-dark-border"}`}
          >
            <Text className={`text-xs font-semibold ${student.status === "present" ? "text-white" : "text-gray-500"}`}>
              {student.status === "present" ? "Present" : "Absent"}
            </Text>
          </TouchableOpacity>
        )}

        {showActions && (
          <>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} className="bg-dark-lighter p-2 rounded-lg" activeOpacity={0.7}>
                <Ionicons name="create-outline" size={20} color="#0EA5E9" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} className="bg-dark-lighter p-2 rounded-lg" activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  )
}
