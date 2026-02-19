import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/components/ui/Button";
import { ProgressDots } from "@/components/ui/ProgressDots";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#fff5f8", "#ffe4f0"]} className="flex-1">
      {/* Skip */}
      <View className="flex-row justify-end px-4 pt-14">
        <TouchableOpacity
          onPress={() => router.push("/onboarding/last-period")}
          className="px-4 py-2"
        >
          <Text className="text-brand font-semibold text-sm">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration */}
      <View className="flex-1 items-center justify-center px-6">
        <LinearGradient
          colors={["#fce4ec", "#f8bbd0", "#f48fb1"]}
          className="w-full aspect-square rounded-2xl items-center justify-center overflow-hidden"
        >
          <View className="w-48 h-48 relative">
            <View className="w-16 h-16 rounded-full bg-[#d4a574] absolute top-5 left-7 border-[3px] border-white" />
            <View className="w-16 h-16 rounded-full bg-[#8d5524] absolute top-2.5 left-20 border-[3px] border-white" />
            <View className="w-16 h-16 rounded-full bg-[#f5cba7] absolute top-10 left-14 border-[3px] border-white" />
            <View className="w-16 h-16 rounded-full bg-[#6b3a2a] absolute top-6 left-28 border-[3px] border-white" />
          </View>
        </LinearGradient>
      </View>

      {/* Text */}
      <View className="items-center px-8 pt-8 pb-4">
        <Text className="text-4xl font-extrabold text-content text-center tracking-tight">
          Welcome to Her Circle
        </Text>
        <Text className="text-lg font-medium text-content/70 text-center mt-4 leading-7 max-w-75">
          Your personal guide to understanding your body and cycle with love.
        </Text>
      </View>

      <ProgressDots total={3} current={0} />

      {/* Actions */}
      <View className="px-6 pb-12 gap-4">
        <Button
          title="Get Started"
          onPress={() => router.push("/onboarding/last-period")}
        />
        <TouchableOpacity className="items-center py-2">
          <Text className="text-content/60 font-semibold text-xs">
            {"Already have an account? "}
            <Text className="text-brand">Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
