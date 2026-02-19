import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import {
  getCycleDay, getCyclePhase, getPhaseLabel,
  getDaysUntilPeriod, getCycleProgress, getPhaseInsight,
} from "@/utils/cycle";

export default function HomeScreen() {
  const router = useRouter();
  const { userName, onboardingData } = useApp();
  const lastPeriod = onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLength = onboardingData.cycleLength || 28;
  const cycleDay = getCycleDay(lastPeriod, cycleLength);
  const phase = getCyclePhase(cycleDay, cycleLength);
  const daysUntil = getDaysUntilPeriod(cycleDay, cycleLength);
  const progress = getCycleProgress(cycleDay, cycleLength);

  return (
    <View className="flex-1 bg-surface">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-2 bg-white/80">
        <TouchableOpacity className="w-11 h-11 items-center justify-center">
          <MaterialIcons name="menu" size={24} color="#181114" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-content tracking-tight">
          Good morning, {userName}
        </Text>
        <TouchableOpacity className="w-11 h-11 items-center justify-center">
          <MaterialIcons name="notifications-none" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Cycle Ring */}
        <View className="items-center py-8">
          <View className="w-72 h-72 rounded-full items-center justify-center relative">
            <View className="absolute w-72 h-72 rounded-full border-14 border-brand/20" />
            <View className="w-64 h-64 rounded-full bg-white items-center justify-center shadow-xl shadow-brand/10 border-4 border-white">
              <Text className="text-xs font-bold text-brand tracking-[3px] mb-1">
                {getPhaseLabel(phase).toUpperCase()}
              </Text>
              <Text className="text-6xl font-extrabold text-content">Day {cycleDay}</Text>
              <Text className="text-sm text-content-secondary font-medium mt-2">
                Period in {daysUntil} days
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white rounded-2xl p-4 shadow-sm shadow-brand/5 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-medium text-content">Cycle Progress</Text>
            <Text className="text-xs font-bold text-brand uppercase">{progress}%</Text>
          </View>
          <View className="h-3 rounded-full bg-[#e6dbe0] overflow-hidden">
            <View className="h-full rounded-full bg-brand" style={{ width: `${progress}%` as any }} />
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-2xl font-bold text-content text-center mb-4 tracking-tight">
          How are you feeling today?
        </Text>
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 bg-brand rounded-full h-14"
            onPress={() => router.push("/(tabs)/log")}
          >
            <MaterialIcons name="edit-note" size={22} color="#fff" />
            <Text className="text-white text-base font-bold">Log symptoms</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-brand-light rounded-full h-14">
            <MaterialIcons name="mood" size={22} color="#f90680" />
            <Text className="text-brand text-base font-bold">Daily mood</Text>
          </TouchableOpacity>
        </View>

        {/* Insights */}
        <Text className="text-lg font-bold text-content mb-3">Insights for you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 pb-4">
          <View className="w-44 bg-[#f5f0f2] rounded-2xl p-5 gap-2 border border-line">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="favorite" size={18} color="#f90680" />
              <Text className="text-[10px] font-bold text-brand tracking-widest">HEALTH</Text>
            </View>
            <Text className="text-lg font-bold text-content">High Energy</Text>
            <Text className="text-[10px] text-content-secondary leading-4">
              Great day for a workout or starting new projects!
            </Text>
          </View>
          <View className="w-44 bg-[#f5f0f2] rounded-2xl p-5 gap-2 border border-line">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="child-care" size={18} color="#f90680" />
              <Text className="text-[10px] font-bold text-brand tracking-widest">FERTILITY</Text>
            </View>
            <Text className="text-lg font-bold text-content">
              {phase === "ovulation" ? "Peak" : phase === "follicular" ? "High Chance" : "Low"}
            </Text>
            <Text className="text-[10px] text-content-secondary leading-4">{getPhaseInsight(phase)}</Text>
          </View>
        </ScrollView>

      </ScrollView>
    </View>
  );
}
