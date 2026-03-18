import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import {
  getCycleDay,
  getCyclePhase,
  getPhaseLabel,
  getDaysUntilPeriod,
} from "../../utils/cycle";

const symptoms = [
  { label: "Low Energy", icon: "battery-2-bar" },
  { label: "Cramps", icon: "healing" },
  { label: "Mood Swings", icon: "sentiment-dissatisfied" },
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
    <View className="flex-1 bg-background-light pt-12">
      <Header showBack title="Partner View" />

      <ScrollView className="px-5" showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        {/* Partner Avatar Row */}
        <View className="flex-row items-center gap-4 mt-4">
          <View 
            className="w-14 h-14 rounded-full bg-primary items-center justify-center"
            style={{
              shadowColor: Colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-xl font-bold text-rose-900">
              {userName.charAt(0)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-slate-800">
              {userName}{"'"}s Cycle
            </Text>
            <Text className="text-sm text-slate-500">Day {cycleDay} of {cycleLength}</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center">
            <MaterialIcons name="notifications-none" size={22} color={Colors.rose[500]} />
          </TouchableOpacity>
        </View>

        {/* Countdown Card */}
        <View 
          className="bg-slate-900 rounded-3xl mt-6 overflow-hidden"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.2,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          <View className="items-center pt-8 pb-4">
            <Text className="text-7xl font-extrabold text-white">
              {daysUntil}
            </Text>
            <Text className="text-xs font-bold text-white/60 tracking-[3px] mt-1">
              DAYS UNTIL PERIOD
            </Text>
          </View>
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="px-3 py-1 rounded-full bg-rose-50">
                <Text className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                  {getPhaseLabel(phase)}
                </Text>
              </View>
            </View>
            <Text className="text-lg font-bold text-slate-800">
              Period starts in {daysUntil} days
            </Text>
            <Text className="text-sm text-slate-500 mt-2 leading-relaxed">
              {userName} is on day {cycleDay}. They might need some extra care and understanding right now.
            </Text>
          </View>
        </View>

        {/* Current Mood */}
        <Text className="text-lg font-bold text-slate-800 mt-8 mb-3">
          How They Might Feel
        </Text>
        <View 
          className="bg-white rounded-3xl p-5 flex-row items-center border border-slate-100"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-lg bg-amber-50 items-center justify-center">
                <MaterialIcons name="sentiment-neutral" size={18} color={Colors.warning} />
              </View>
              <Text className="text-base font-bold text-slate-800">
                Feeling Sensitive
              </Text>
            </View>
            <Text className="text-sm text-slate-500 leading-relaxed">
              <Text className="font-bold text-rose-500">Pro-tip:</Text> Some extra chocolate, a warm hug, or a cozy movie night might help!
            </Text>
          </View>
          <View className="w-16 h-16 rounded-2xl bg-amber-50 items-center justify-center ml-3">
            <MaterialIcons name="cookie" size={32} color="#d4a574" />
          </View>
        </View>

        {/* Send a Gift */}
        <Text className="text-lg font-bold text-slate-800 mt-8 mb-1">
          Show You Care
        </Text>
        <Text className="text-sm text-slate-500 mb-4">
          Send a thoughtful gift
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl py-5 items-center border border-slate-100"
            onPress={() => router.push("/partner/gift-selection")}
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View className="w-12 h-12 rounded-xl bg-rose-50 items-center justify-center mb-2">
              <MaterialIcons name="local-florist" size={24} color={Colors.rose[500]} />
            </View>
            <Text className="text-sm font-bold text-slate-700">Flowers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl py-5 items-center border border-slate-100"
            onPress={() => router.push("/partner/gift-selection")}
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View className="w-12 h-12 rounded-xl bg-amber-50 items-center justify-center mb-2">
              <MaterialIcons name="cookie" size={24} color={Colors.warning} />
            </View>
            <Text className="text-sm font-bold text-slate-700">Treats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl py-5 items-center border border-slate-100"
            onPress={() => router.push("/partner/gift-selection")}
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mb-2">
              <MaterialIcons name="spa" size={24} color={Colors.indigo[500]} />
            </View>
            <Text className="text-sm font-bold text-slate-700">Self-Care</Text>
          </TouchableOpacity>
        </View>

        {/* Send Support */}
        <View className="mt-8">
          <Button
            title="Send Love"
            onPress={() => {}}
            icon={<MaterialIcons name="favorite" size={20} color={Colors.rose[900]} />}
          />
        </View>

        {/* Logged Symptoms */}
        <Text className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-8 mb-3">
          Recent Symptoms
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {symptoms.map((s) => (
            <View
              key={s.label}
              className="flex-row items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-100"
            >
              <MaterialIcons name={s.icon as any} size={16} color={Colors.slate[500]} />
              <Text className="text-sm text-slate-600 font-medium">{s.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
