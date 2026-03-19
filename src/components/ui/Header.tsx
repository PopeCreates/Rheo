import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { HeaderProps } from "@/types/interface";
import { Colors } from "@/constants/colors";

export function Header({
  title,
  subtitle,
  showBack = false,
  rightAction,
  stepText,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View className="px-5 py-3">
      <View className="flex-row items-center justify-between">
        {showBack ? (
          <TouchableOpacity
            className="w-11 h-11 items-center justify-center rounded-full bg-white border border-slate-100"
            onPress={() => router.back()}
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <View className="w-11" />
        )}

        <View className="flex-1 items-center">
          {stepText ? (
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {stepText}
            </Text>
          ) : title ? (
            <Text className="text-lg font-extrabold text-slate-800 text-center">
              {title}
            </Text>
          ) : null}
          {subtitle && (
            <Text className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction || <View className="w-11" />}
      </View>
    </View>
  );
}
