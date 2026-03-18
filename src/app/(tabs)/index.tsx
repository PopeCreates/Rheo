import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";
import {
  getCycleDay,
  getCyclePhase,
  getPhaseLabel,
  getDaysUntilPeriod,
  getPhaseInsight,
} from "@/utils/cycle";

export default function HomeScreen() {
  const router = useRouter();
  const { userName, onboardingData } = useApp();
  const lastPeriod =
    onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLength = onboardingData.cycleLength || 28;
  const cycleDay = getCycleDay(lastPeriod, cycleLength);
  const phase = getCyclePhase(cycleDay, cycleLength);
  const daysUntil = getDaysUntilPeriod(cycleDay, cycleLength);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <View className="flex-1 bg-background-light">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pt-14 pb-4 bg-white/80 border-b border-slate-100"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <View className="flex-row items-center gap-3">
          <View
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-rose-200 p-0.5"
            style={{
              shadowColor: Colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View className="w-full h-full rounded-full bg-primary items-center justify-center border-2 border-white">
              <MaterialIcons name="person" size={20} color={Colors.rose[500]} />
            </View>
          </View>
          <View>
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {today}
            </Text>
            <Text className="text-lg font-extrabold text-slate-800 leading-tight">
              Hello, {userName || "there"}!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-white items-center justify-center border border-slate-100"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <MaterialIcons name="notifications" size={22} color={Colors.slate[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Status Card */}
        <View
          className="bg-white rounded-[2rem] p-6 mt-6 border border-rose-50 relative overflow-hidden"
          style={{
            shadowColor: Colors.rose[200],
            shadowOpacity: 0.5,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="bg-rose-50 self-start px-3 py-1 rounded-full border border-rose-100 mb-3">
                <Text className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                  Current Phase
                </Text>
              </View>
              <Text className="text-4xl font-black text-slate-800">
                Day {cycleDay}
              </Text>
              <Text className="text-xl font-bold text-rose-500 mt-1">
                {getPhaseLabel(phase)}
              </Text>
            </View>

            {/* Bunny mascot */}
            <View
              className="w-28 h-28 rounded-full bg-gradient-to-b from-primary/30 to-primary/10 items-center justify-center border-4 border-white"
              style={{
                shadowColor: Colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <MaterialIcons name="pets" size={56} color={Colors.rose[400]} />
            </View>
          </View>

          {/* Insight message */}
          <View className="bg-slate-50 rounded-2xl p-4 mt-4 border border-slate-100">
            <Text className="text-slate-600 text-sm leading-relaxed">
              {getPhaseInsight(phase)}
            </Text>
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-primary py-4 rounded-xl"
              onPress={() => router.push("/log-modal")}
              style={{
                shadowColor: Colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <MaterialIcons name="add-circle" size={20} color={Colors.rose[900]} />
              <Text className="text-rose-900 font-bold">Log Symptoms</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-14 h-14 items-center justify-center bg-white rounded-xl border border-slate-200"
              onPress={() => router.push("/(tabs)/insights")}
            >
              <MaterialIcons name="analytics" size={24} color={Colors.slate[600]} />
            </TouchableOpacity>
          </View>

          {/* Decorative blurs */}
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <View className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-100/30 rounded-full blur-3xl" />
        </View>

        {/* Daily Insights Grid */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-lg font-extrabold text-slate-800 tracking-tight">
              Daily Insights
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.push("/(tabs)/insights")}
            >
              <Text className="text-rose-400 text-sm font-bold">Trends</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.rose[400]} />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4">
            {/* Mood Card */}
            <TouchableOpacity
              className="flex-1 bg-white p-5 rounded-3xl border border-slate-100"
              style={{
                shadowColor: Colors.black,
                shadowOpacity: 0.05,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center mb-4">
                <MaterialIcons name="bedtime" size={24} color={Colors.indigo[500]} />
              </View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Mood
              </Text>
              <Text className="text-lg font-extrabold text-slate-800">
                {phase === "menstrual" ? "Low Energy" : phase === "ovulation" ? "High Energy" : "Balanced"}
              </Text>
            </TouchableOpacity>

            {/* Symptoms Card */}
            <TouchableOpacity
              className="flex-1 bg-white p-5 rounded-3xl border border-slate-100"
              style={{
                shadowColor: Colors.black,
                shadowOpacity: 0.05,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <View className="w-12 h-12 rounded-2xl bg-rose-50 items-center justify-center mb-4">
                <MaterialIcons name="thermostat" size={24} color={Colors.rose[500]} />
              </View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Symptoms
              </Text>
              <Text className="text-lg font-extrabold text-slate-800">
                {phase === "menstrual" ? "Mild Cramps" : "None logged"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Prediction Card */}
        <TouchableOpacity
          className="bg-slate-900 p-6 rounded-3xl mt-6 relative overflow-hidden"
          onPress={() => router.push("/(tabs)/calendar")}
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.2,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View className="flex-row items-center gap-5">
            <View className="w-14 h-14 rounded-full border-[3px] border-primary/30 items-center justify-center bg-white/10">
              <Text className="text-lg font-black text-primary">{daysUntil}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-slate-200">
                {phase === "menstrual" ? "Period ends in" : "Fertile Window"}
              </Text>
              <Text className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                {phase === "menstrual" ? `${5 - cycleDay} days` : `Starts in ${daysUntil} days`}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
              <MaterialIcons name="calendar-today" size={20} color={Colors.white} />
            </View>
          </View>
          <MaterialIcons
            name="auto-awesome"
            size={80}
            color="rgba(255,255,255,0.05)"
            style={{ position: "absolute", right: -10, bottom: -10 }}
          />
        </TouchableOpacity>

        {/* Partner Card */}
        <TouchableOpacity
          className="bg-white p-5 rounded-3xl mt-6 border border-slate-100 flex-row items-center gap-4"
          onPress={() => router.push("/partner/dashboard")}
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <View className="w-14 h-14 rounded-2xl bg-rose-50 items-center justify-center">
            <MaterialIcons name="favorite" size={28} color={Colors.rose[400]} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-800">Partner Sync</Text>
            <Text className="text-sm text-slate-500">Share your cycle with loved ones</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.slate[400]} />
        </TouchableOpacity>

        {/* Cycle Care Section */}
        <View className="mt-8">
          <Text className="text-lg font-extrabold text-slate-800 tracking-tight mb-4 px-1">
            Cycle Care
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingRight: 20 }}
          >
            {/* Tip 1 */}
            <View
              className="w-64 bg-primary/20 rounded-[2rem] p-6 border border-primary/30 h-44 justify-between relative overflow-hidden"
            >
              <View>
                <Text className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">
                  Nutrition
                </Text>
                <Text className="text-xl font-extrabold text-slate-800 leading-tight">
                  Hydration is key
                </Text>
                <Text className="text-slate-600 text-sm mt-1">
                  Drink 2L to ease bloating.
                </Text>
              </View>
              <TouchableOpacity className="bg-white px-5 py-2.5 rounded-full self-start">
                <Text className="text-[11px] font-black text-slate-800">Read More</Text>
              </TouchableOpacity>
              <MaterialIcons
                name="water-drop"
                size={100}
                color="rgba(254,207,213,0.3)"
                style={{ position: "absolute", right: -20, bottom: -20 }}
              />
            </View>

            {/* Tip 2 */}
            <View
              className="w-64 bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100 h-44 justify-between relative overflow-hidden"
            >
              <View>
                <Text className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                  Relaxation
                </Text>
                <Text className="text-xl font-extrabold text-slate-800 leading-tight">
                  Light Yoga
                </Text>
                <Text className="text-slate-600 text-sm mt-1">
                  Relieve lower back pain.
                </Text>
              </View>
              <TouchableOpacity className="bg-white px-5 py-2.5 rounded-full self-start">
                <Text className="text-[11px] font-black text-slate-800">Try Now</Text>
              </TouchableOpacity>
              <MaterialIcons
                name="self-improvement"
                size={100}
                color="rgba(99,102,241,0.15)"
                style={{ position: "absolute", right: -20, bottom: -20 }}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
