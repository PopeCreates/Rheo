import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconCircle } from "@/components/ui/IconCircle";
import { useApp } from "@/context/AppContext";
import type { GoalOption, AppGoal } from "@/types/interface";

const goals: GoalOption[] = [
  { id: "track_cycle", title: "Track Cycle", subtitle: "Understand your rhythm", icon: "local-florist" },
  { id: "plan_pregnancy", title: "Plan Pregnancy", subtitle: "Find your fertile window", icon: "child-care" },
  { id: "health_insights", title: "Health Insights", subtitle: "Deep dive into symptoms", icon: "auto-awesome" },
];

export default function SelectGoalScreen() {
  const router = useRouter();
  const { setOnboardingData, onboardingData } = useApp();
  const [selected, setSelected] = useState<AppGoal | null>(onboardingData.goal || "track_cycle");

  const handleContinue = () => {
    setOnboardingData({ goal: selected });
    router.push("/onboarding/cycle-length");
  };

  return (
    <View className="flex-1 bg-surface pt-12">
      <Header showBack stepText="Step 3 of 5" />
      <ProgressDots total={5} current={2} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-content text-center pt-8 tracking-tight">
          {"What's your goal?"}
        </Text>
        <Text className="text-base text-[#896175] text-center mt-2 px-8">
          {"We'll customize your experience based on your needs."}
        </Text>

        <View className="gap-4 mt-8">
          {goals.map((goal) => (
            <TouchableOpacity key={goal.id} onPress={() => setSelected(goal.id)} activeOpacity={0.8}>
              <Card selected={selected === goal.id}>
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1 gap-1">
                    <Text className="text-lg font-bold text-content">{goal.title}</Text>
                    <Text className="text-sm text-[#896175]">{goal.subtitle}</Text>
                  </View>
                  <IconCircle name={goal.icon as keyof typeof MaterialIcons.glyphMap} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pb-10">
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
}
