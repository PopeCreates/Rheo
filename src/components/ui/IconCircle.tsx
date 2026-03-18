import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface IconCircleProps {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  bgClassName?: string;
  circleSize?: "sm" | "md" | "lg";
}

const circleSizeClasses: Record<string, string> = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

export function IconCircle({
  name,
  size = 24,
  color = Colors.rose[500],
  bgClassName = "bg-rose-50",
  circleSize = "md",
}: IconCircleProps) {
  return (
    <View className={`${circleSizeClasses[circleSize]} rounded-2xl items-center justify-center ${bgClassName}`}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
}
