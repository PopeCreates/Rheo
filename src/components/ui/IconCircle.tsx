import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface IconCircleProps {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  bgClassName?: string;
}

export function IconCircle({
  name,
  size = 28,
  color = "#f90680",
  bgClassName = "bg-brand-light",
}: IconCircleProps) {
  return (
    <View className={`w-14 h-14 rounded-full items-center justify-center ${bgClassName}`}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
}
