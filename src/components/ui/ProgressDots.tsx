import React from "react";
import { View } from "react-native";
import type { ProgressDotsProps } from "@/types/interface";

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-1.5 rounded-full ${
            i === current ? "w-8 bg-brand" : "w-1.5 bg-brand-light"
          }`}
        />
      ))}
    </View>
  );
}
