import React from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { getCycleDay, getCyclePhase, getPhaseLabel, getPhaseInsight, getCycleProgress } from "@/utils/cycle";

export default function InsightsScreen() {
  const { onboardingData, dailyLogs } = useApp();
  const lastPeriod = onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLen = onboardingData.cycleLength || 28;
  const cycleDay = getCycleDay(lastPeriod, cycleLen);
  const phase = getCyclePhase(cycleDay, cycleLen);
  const progress = getCycleProgress(cycleDay, cycleLen);

  const insights = [
    { icon: "favorite" as const, label: "CYCLE HEALTH", title: getPhaseLabel(phase), body: getPhaseInsight(phase), color: "#f90680" },
    { icon: "water-drop" as const, label: "HYDRATION", title: "Stay Hydrated", body: "Aim for 8-10 glasses of water today. Proper hydration helps reduce bloating and headaches.", color: "#3b82f6" },
    { icon: "bedtime" as const, label: "SLEEP", title: "Rest Well", body: "During this phase, you may need 7-9 hours of quality sleep. Try winding down an hour before bed.", color: "#6366f1" },
    { icon: "fitness-center" as const, label: "EXERCISE", title: phase === "menstrual" ? "Gentle Movement" : "Active Day", body: phase === "menstrual" ? "Light yoga or walking is ideal during your period." : "Your energy levels support moderate to high intensity workouts!", color: "#22c55e" },
    { icon: "restaurant" as const, label: "NUTRITION", title: "Fuel Your Body", body: "Focus on iron-rich foods and leafy greens. Magnesium-rich snacks like dark chocolate can help.", color: "#fbbf24" },
  ];

  return (
    <View className="flex-1 bg-surface">
      <View className="px-4 pt-14 pb-4">
        <Text className="text-3xl font-extrabold text-content tracking-tight">Insights</Text>
        <Text className="text-sm text-content-secondary mt-1">Personalized tips for Day {cycleDay}</Text>
      </View>

      <ScrollView className="px-4" contentContainerClassName="gap-4 pb-32" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-brand rounded-4xl p-5 shadow-lg shadow-brand/30">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-white">{getPhaseLabel(phase)}</Text>
              <Text className="text-xs text-white/70 mt-0.5">Day {cycleDay} of {cycleLen}</Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-sm font-bold text-white">{progress}%</Text>
            </View>
          </View>
            <View className="h-2 rounded-full bg-white/20 overflow-hidden">
            <View className="h-full rounded-full bg-white" style={{ width: `${progress}%` as any }} />
          </View>
        </View>

        {/* Cards */}
        {insights.map((ins, i) => (
          <View key={i} className="bg-white rounded-3xl p-5 border border-line gap-2">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: `${ins.color}15` as any }}>
                <MaterialIcons name={ins.icon} size={22} color={ins.color} />
              </View>
              <Text className="text-[10px] font-bold tracking-widest" style={{ color: ins.color } as any}>{ins.label}</Text>
            </View>
            <Text className="text-lg font-bold text-content">{ins.title}</Text>
            <Text className="text-sm text-content-secondary leading-5">{ins.body}</Text>
          </View>
        ))}

        {/* Log Summary */}
        <View className="bg-surface-soft rounded-4xl p-5 border border-line-light">
          <Text className="text-base font-bold text-content text-center mb-4">Your Logging Streak</Text>
          <View className="flex-row items-center justify-around">
            {[{ n: dailyLogs.length, l: "Days Logged" }, { n: cycleLen, l: "Cycle Length" }, { n: 5, l: "Period Days" }].map((s, i) => (
              <React.Fragment key={s.l}>
                {i > 0 && <View className="w-px h-10 bg-line-light" />}
                <View className="items-center gap-1">
                  <Text className="text-2xl font-extrabold text-brand">{s.n}</Text>
                  <Text className="text-xs text-content-secondary font-medium">{s.l}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
