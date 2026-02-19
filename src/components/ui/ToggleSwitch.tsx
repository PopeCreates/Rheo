import React from "react";
import { TouchableOpacity, View } from "react-native";
import type { ToggleSwitchProps } from "@/types/interface";

export function ToggleSwitch({ value, onToggle }: ToggleSwitchProps) {
  return (
    <TouchableOpacity
      className={`w-12.75 h-7.75 rounded-2xl p-0.5 justify-center ${
        value ? "bg-brand" : "bg-[#e2d5da]"
      }`}
      onPress={() => onToggle(!value)}
      activeOpacity={0.8}
    >
      <View
        className={`w-6.75 h-6.75 rounded-full bg-white shadow ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </TouchableOpacity>
  );
}
