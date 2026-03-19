import React from "react";
import { View } from "react-native";
import type { ProgressDotsProps } from "@/types/interface";

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-1.5 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full transition-all ${
            i === current 
              ? "w-6 bg-primary" 
              : i < current 
                ? "w-2 bg-primary/60" 
                : "w-2 bg-primary/30"
          }`}
        />
      ))}
    </View>
  );
}
