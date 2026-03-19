import React from "react";
import { View } from "react-native";
import type { CardProps } from "@/types/interface";
import { Colors } from "@/constants/colors";

export function Card({ children, className = "", selected = false }: CardProps) {
  return (
    <View
      className={`bg-white rounded-3xl p-6 border
        ${selected ? "border-primary bg-rose-50/50" : "border-slate-100"}
        ${className}`}
      style={{
        shadowColor: selected ? Colors.primary : Colors.black,
        shadowOpacity: selected ? 0.15 : 0.05,
        shadowRadius: selected ? 12 : 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: selected ? 4 : 2,
      }}
    >
      {children}
    </View>
  );
}
