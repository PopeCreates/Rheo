import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";

export default function NotificationsScreen() {
  const router = useRouter();
  const { setOnboardingData, completeOnboarding } = useApp();

  const handleEnable = () => {
    setOnboardingData({ notificationsEnabled: true });
    completeOnboarding();
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    setOnboardingData({ notificationsEnabled: false });
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-white pt-14">
      <ProgressDots total={5} current={4} />

      {/* Hero */}
      <View className="flex-1 items-center justify-center">
        <View className="w-72 h-72 rounded-full bg-brand-light/50 items-center justify-center">
          {/* Dashed ring */}
          <View className="absolute w-67.5 h-67.5 rounded-full border-2 border-dashed border-brand-light" />
          {/* Icon card */}
          <View className="w-48 h-48 rounded-4xl bg-white items-center justify-center shadow-xl">
            <MaterialIcons name="notifications-active" size={80} color="#f90680" />
            {/* Badge */}
            <View className="absolute -top-3 -right-2 w-12 h-12 rounded-full bg-brand items-center justify-center shadow-lg shadow-brand/30 rotate-12">
              <MaterialIcons name="card-giftcard" size={22} color="#fff" />
            </View>
          </View>
        </View>
      </View>

      {/* Text */}
      <View className="px-8 pb-6">
        <Text className="text-3xl font-bold text-content text-center tracking-tight">
          Never be surprised again.
        </Text>
        <Text className="text-lg text-content/60 text-center mt-4 leading-7">
          Enable notifications for period predictions and health tips tailored for you.
        </Text>
      </View>

      {/* Actions */}
      <View className="px-8 pb-12 gap-3">
        <Button title="Enable Notifications" onPress={handleEnable} />
        <TouchableOpacity className="items-center py-3" onPress={handleSkip}>
          <Text className="text-base font-medium text-content/40">Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
