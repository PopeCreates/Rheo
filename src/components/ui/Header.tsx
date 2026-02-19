import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { HeaderProps } from "@/types/interface";

export function Header({
  title,
  subtitle,
  showBack = false,
  rightAction,
  stepText,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center justify-between">
        {showBack ? (
          <TouchableOpacity
            className="w-11 h-11 items-center justify-center"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back-ios" size={22} color="#181114" />
          </TouchableOpacity>
        ) : (
          <View className="w-11" />
        )}

        <View className="flex-1 items-center">
          {stepText ? (
            <Text className="text-sm font-semibold text-content uppercase tracking-widest">
              {stepText}
            </Text>
          ) : title ? (
            <Text className="text-lg font-bold text-content text-center">
              {title}
            </Text>
          ) : null}
          {subtitle && (
            <Text className="text-xs font-bold text-brand uppercase tracking-widest mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction || <View className="w-11" />}
      </View>
    </View>
  );
}
