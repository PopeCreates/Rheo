import React from "react";
import { View } from "react-native";
import type { CardProps } from "@/types/interface";

export function Card({ children, className = "", selected = false }: CardProps) {
  return (
    <View
      className={`bg-surface-card rounded-2xl p-5 border-2 shadow-sm
        ${selected ? "border-brand bg-brand-light/30" : "border-line"}
        ${className}`}
    >
      {children}
    </View>
  );
}
