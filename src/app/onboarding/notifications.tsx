import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";

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
    <View className="flex-1 bg-background-light pt-14">
      <ProgressDots total={4} current={3} />

      {/* Hero */}
      <View className="flex-1 items-center justify-center px-8">
        <View 
          className="w-64 h-64 rounded-full bg-primary/20 items-center justify-center"
          style={{
            shadowColor: Colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 0 },
          }}
        >
          {/* Icon card */}
          <View 
            className="w-40 h-40 rounded-3xl bg-white items-center justify-center"
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <MaterialIcons name="notifications-active" size={72} color={Colors.rose[400]} />
            {/* Badge */}
            <View 
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary items-center justify-center"
              style={{
                shadowColor: Colors.primary,
                shadowOpacity: 0.4,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <MaterialIcons name="pets" size={20} color={Colors.rose[900]} />
            </View>
          </View>
        </View>
      </View>

      {/* Text */}
      <View className="px-8 pb-6">
        <Text className="text-3xl font-extrabold text-slate-800 text-center tracking-tight">
          Stay in the loop
        </Text>
        <Text className="text-base text-slate-500 text-center mt-3 leading-relaxed">
          Get gentle reminders for your cycle predictions and personalized wellness tips from your bunny companion.
        </Text>
      </View>

      {/* Actions */}
      <View className="px-8 pb-12 gap-3">
        <Button 
          title="Enable Notifications" 
          onPress={handleEnable}
          icon={<MaterialIcons name="notifications" size={20} color={Colors.rose[900]} />}
        />
        <TouchableOpacity className="items-center py-3" onPress={handleSkip}>
          <Text className="text-base font-medium text-slate-400">Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
