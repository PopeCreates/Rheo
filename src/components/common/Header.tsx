"use client"

import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import type { HeaderProps } from "../../interfaces/interface"

export function Header({ title, subtitle, rightElement, showBack = true }: HeaderProps) {
  const router = useRouter()

  return (
    <View className="flex-row justify-between items-center px-5 pt-14 pb-5">
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center items-start">
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold text-white">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-400">{subtitle}</Text>}
      </View>
      {rightElement || <View className="w-10" />}
    </View>
  )
}
