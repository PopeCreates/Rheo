import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import {
  getCycleDay,
  getCyclePhase,
  getPhaseLabel,
  getDaysUntilPeriod,
  getPhaseInsight,
} from "../../utils/cycle";

const symptoms = [
  { label: "Low Energy", icon: "battery-2-bar" },
  { label: "Cramps", icon: "healing" },
  { label: "Irritable", icon: "sentiment-dissatisfied" },
];

export default function PartnerDashboardScreen() {
  const router = useRouter();
  const { userName, onboardingData } = useApp();
  const lastPeriod =
    onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLength = onboardingData.cycleLength || 28;
  const cycleDay = getCycleDay(lastPeriod, cycleLength);
  const phase = getCyclePhase(cycleDay, cycleLength);
  const daysUntil = getDaysUntilPeriod(cycleDay, cycleLength);

  return (
    <View className="flex-1 bg-surface pt-12">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-4 pb-2">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full bg-brand-light items-center justify-center">
            <Text className="text-lg font-bold text-brand">
              {userName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text className="text-lg font-bold text-content">
              {userName}{"'"}s Cycle
            </Text>
          </View>
        </View>
        <TouchableOpacity className="w-11 h-11 items-center justify-center">
          <MaterialIcons name="notifications-none" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Countdown Card */}
        <View className="bg-brand rounded-3xl mt-4 overflow-hidden">
          <View className="items-center pt-10 pb-6">
            <Text className="text-7xl font-extrabold text-white">
              {daysUntil}
            </Text>
            <Text className="text-sm font-bold text-white/80 tracking-[3px] mt-1">
              DAYS TO GO
            </Text>
          </View>
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-6">
            <Text className="text-xl font-bold text-content">
              Period starts in {daysUntil} days
            </Text>
            <Text className="text-sm font-bold text-brand mt-1 tracking-widest">
              PHASE: {getPhaseLabel(phase).toUpperCase()}
            </Text>
            <Text className="text-sm text-content-secondary mt-2 leading-5">
              The cycle is currently on day {cycleDay}. {userName} might be
              feeling a bit more tired or sensitive than usual.
            </Text>
          </View>
        </View>

        {/* Current Mood */}
        <Text className="text-xl font-bold text-content mt-8 mb-3">
          Current Mood
        </Text>
        <View className="bg-surface-soft rounded-3xl p-5 flex-row items-center">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialIcons
                name="sentiment-dissatisfied"
                size={20}
                color="#8c5f75"
              />
              <Text className="text-base font-bold text-content">
                Feeling Sensitive
              </Text>
            </View>
            <Text className="text-sm text-content-secondary leading-5 mt-1">
              <Text className="font-bold text-brand">Pro-tip:</Text> She might
              need some extra chocolate, a warm hug, or a movie night in!
            </Text>
          </View>
          <View className="w-20 h-20 rounded-full bg-surface items-center justify-center ml-3">
            <MaterialIcons name="cookie" size={36} color="#d4a574" />
          </View>
        </View>

        {/* Send a Gift */}
        <Text className="text-xl font-bold text-content mt-8 mb-1">
          Send a Gift
        </Text>
        <Text className="text-sm text-content-secondary mb-4">
          Brighten her day
        </Text>
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl py-6 items-center border border-line"
            onPress={() => router.push("/partner/gift-selection")}
          >
            <MaterialIcons name="local-florist" size={32} color="#f90680" />
            <Text className="text-sm font-bold text-content mt-3">
              Send Flowers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl py-6 items-center border border-line"
            onPress={() => router.push("/partner/gift-selection")}
          >
            <MaterialIcons name="cookie" size={32} color="#f90680" />
            <Text className="text-sm font-bold text-content mt-3">
              Send Chocolate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Send Support */}
        <Text className="text-xl font-bold text-content mt-8 mb-3">
          Send Support
        </Text>
        <Button
          title="Send Love"
          onPress={() => {}}
          icon={<MaterialIcons name="favorite" size={22} color="#fff" />}
        />

        {/* Logged Symptoms */}
        <Text className="text-xs font-bold text-content-secondary tracking-[3px] mt-8 mb-3">
          LOGGED SYMPTOMS
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-10">
          {symptoms.map((s) => (
            <View
              key={s.label}
              className="flex-row items-center gap-2 bg-surface-soft rounded-full px-4 py-2"
            >
              <MaterialIcons
                name={s.icon as any}
                size={16}
                color="#8c5f75"
              />
              <Text className="text-sm text-content-secondary font-medium">
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
