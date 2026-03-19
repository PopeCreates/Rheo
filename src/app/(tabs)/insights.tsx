import React from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";
import { getCycleDay, getCyclePhase, getPhaseLabel, getPhaseInsight, getCycleProgress } from "@/utils/cycle";

export default function InsightsScreen() {
  const { onboardingData, dailyLogs } = useApp();
  const lastPeriod = onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLen = onboardingData.cycleLength || 28;
  const cycleDay = getCycleDay(lastPeriod, cycleLen);
  const phase = getCyclePhase(cycleDay, cycleLen);
  const progress = getCycleProgress(cycleDay, cycleLen);

  const insights = [
    { icon: "favorite" as const, label: "CYCLE HEALTH", title: getPhaseLabel(phase), body: getPhaseInsight(phase), color: Colors.rose[500], bg: "bg-rose-50" },
    { icon: "water-drop" as const, label: "HYDRATION", title: "Stay Hydrated", body: "Aim for 8-10 glasses of water today. Proper hydration helps reduce bloating and headaches.", color: Colors.info, bg: "bg-blue-50" },
    { icon: "bedtime" as const, label: "SLEEP", title: "Rest Well", body: "During this phase, you may need 7-9 hours of quality sleep. Try winding down an hour before bed.", color: Colors.indigo[500], bg: "bg-indigo-50" },
    { icon: "fitness-center" as const, label: "EXERCISE", title: phase === "menstrual" ? "Gentle Movement" : "Active Day", body: phase === "menstrual" ? "Light yoga or walking is ideal during your period." : "Your energy levels support moderate to high intensity workouts!", color: Colors.success, bg: "bg-emerald-50" },
    { icon: "restaurant" as const, label: "NUTRITION", title: "Fuel Your Body", body: "Focus on iron-rich foods and leafy greens. Magnesium-rich snacks like dark chocolate can help.", color: Colors.warning, bg: "bg-amber-50" },
  ];

  return (
    <View className="flex-1 bg-background-light">
      <View className="px-5 pt-16 pb-4">
        <Text className="text-2xl font-extrabold text-slate-800 tracking-tight">Insights</Text>
        <Text className="text-sm text-slate-500 mt-1">Personalized tips for Day {cycleDay}</Text>
      </View>

      <ScrollView className="px-5" contentContainerClassName="gap-4 pb-32" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View 
          className="bg-slate-900 rounded-3xl p-5 overflow-hidden"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.2,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-white">{getPhaseLabel(phase)}</Text>
              <Text className="text-xs text-white/60 mt-0.5">Day {cycleDay} of {cycleLen}</Text>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-white/10 items-center justify-center">
              <Text className="text-sm font-bold text-white">{progress}%</Text>
            </View>
          </View>
          <View className="h-2 rounded-full bg-white/20 overflow-hidden">
            <View className="h-full rounded-full bg-primary" style={{ width: `${progress}%` as any }} />
          </View>
        </View>

        {/* Cards */}
        {insights.map((ins, i) => (
          <View 
            key={i} 
            className="bg-white rounded-2xl p-5 border border-slate-100"
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View className="flex-row items-center gap-3 mb-3">
              <View className={`w-10 h-10 rounded-xl items-center justify-center ${ins.bg}`}>
                <MaterialIcons name={ins.icon} size={20} color={ins.color} />
              </View>
              <Text className="text-[10px] font-bold tracking-widest" style={{ color: ins.color } as any}>{ins.label}</Text>
            </View>
            <Text className="text-lg font-bold text-slate-800">{ins.title}</Text>
            <Text className="text-sm text-slate-500 leading-relaxed mt-1">{ins.body}</Text>
          </View>
        ))}

        {/* Log Summary */}
        <View 
          className="bg-white rounded-2xl p-5 border border-slate-100"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text className="text-base font-bold text-slate-800 text-center mb-4">Your Logging Streak</Text>
          <View className="flex-row items-center justify-around">
            {[{ n: dailyLogs.length, l: "Days Logged" }, { n: cycleLen, l: "Cycle Length" }, { n: 5, l: "Period Days" }].map((s, i) => (
              <React.Fragment key={s.l}>
                {i > 0 && <View className="w-px h-10 bg-slate-100" />}
                <View className="items-center gap-1">
                  <Text className="text-2xl font-extrabold text-rose-500">{s.n}</Text>
                  <Text className="text-xs text-slate-400 font-medium">{s.l}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
