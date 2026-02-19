import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import {
  getMonthDays, getCycleDay, getCyclePhase, getPhaseLabel,
  getPhaseInsight, isPeriodDay, isFertileDay, isOvulationDay, isPredictedPeriod,
} from "@/utils/cycle";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarScreen() {
  const { onboardingData } = useApp();
  const lastPeriod = onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLen = onboardingData.cycleLength || 28;
  const today = new Date();
  const [cMonth, setCMonth] = useState(today.getMonth());
  const [cYear, setCYear] = useState(today.getFullYear());
  const [selDay, setSelDay] = useState(today.getDate());

  const { firstDay, daysInMonth } = getMonthDays(cYear, cMonth);
  const cycleDay = getCycleDay(lastPeriod, cycleLen);
  const phase = getCyclePhase(cycleDay, cycleLen);

  const prev = () => { if (cMonth === 0) { setCMonth(11); setCYear(cYear - 1); } else setCMonth(cMonth - 1); };
  const next = () => { if (cMonth === 11) { setCMonth(0); setCYear(cYear + 1); } else setCMonth(cMonth + 1); };
  const isTd = (d: number) => d === today.getDate() && cMonth === today.getMonth() && cYear === today.getFullYear();

  const renderDay = (day: number) => {
    const period = isPeriodDay(day, cMonth, cYear, lastPeriod, cycleLen);
    const fertile = isFertileDay(day, cMonth, cYear, lastPeriod, cycleLen);
    const ovul = isOvulationDay(day, cMonth, cYear, lastPeriod, cycleLen);
    const predicted = isPredictedPeriod(day, cMonth, cYear, lastPeriod, cycleLen);
    const td = isTd(day);

    if (period) return (
      <TouchableOpacity key={day} className="w-[14.28%] h-12 items-center justify-center bg-brand-light" onPress={() => setSelDay(day)}>
        <View className="w-9 h-9 rounded-full bg-brand items-center justify-center">
          <Text className="text-sm font-bold text-white">{day}</Text>
        </View>
      </TouchableOpacity>
    );
    if (predicted) return (
      <TouchableOpacity key={day} className="w-[14.28%] h-12 items-center justify-center" onPress={() => setSelDay(day)}>
        <View className="w-8 h-8 rounded-full border-2 border-dashed border-brand-muted/40 items-center justify-center">
          <Text className="text-sm font-semibold text-brand-muted">{day}</Text>
        </View>
      </TouchableOpacity>
    );
    if (fertile) return (
      <TouchableOpacity key={day} className="w-[14.28%] h-12 items-center justify-center bg-surface-fertile" onPress={() => setSelDay(day)}>
        <Text className="text-sm font-semibold text-brand">{day}</Text>
        {ovul && <MaterialIcons name="favorite" size={8} color="#f90680" className="absolute bottom-1" />}
      </TouchableOpacity>
    );
    if (td) return (
      <TouchableOpacity key={day} className="w-[14.28%] h-12 items-center justify-center border-2 border-brand rounded-xl" onPress={() => setSelDay(day)}>
        <View className="w-9 h-9 rounded-full bg-black items-center justify-center">
          <Text className="text-sm font-bold text-white">{day}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <TouchableOpacity key={day} className="w-[14.28%] h-12 items-center justify-center" onPress={() => setSelDay(day)}>
        <Text className={`text-sm font-semibold ${selDay === day ? "text-brand font-bold" : "text-content"}`}>{day}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-white/80">
        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center" onPress={prev}>
          <MaterialIcons name="chevron-left" size={24} color="#181114" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-lg font-extrabold text-content tracking-tight">{MONTHS[cMonth]} {cYear}</Text>
          <Text className="text-[10px] font-bold text-brand tracking-[3px]">{getPhaseLabel(phase).toUpperCase()}</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-brand items-center justify-center shadow-lg shadow-brand/30" onPress={next}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View className="bg-white rounded-4xl p-4 shadow-sm border border-line">
          <View className="flex-row mb-2">
            {DAYS.map((d, i) => (
              <Text key={i} className="flex-1 text-center text-[11px] font-bold text-black/30 uppercase">{d}</Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {Array.from({ length: firstDay }).map((_, i) => <View key={`e-${i}`} className="w-[14.28%] h-12" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => renderDay(i + 1))}
          </View>
          {/* Legend */}
          <View className="flex-row gap-4 pt-4 mt-4 border-t border-black/5">
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-brand" />
              <Text className="text-[10px] font-medium text-black/40 tracking-widest">PERIOD</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-surface-fertile" />
              <Text className="text-[10px] font-medium text-black/40 tracking-widest">FERTILE</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full border-[1.5px] border-dashed border-brand-muted/40" />
              <Text className="text-[10px] font-medium text-black/40 tracking-widest">PREDICTED</Text>
            </View>
          </View>
        </View>

        {/* Detail */}
        <View className="mt-4 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-extrabold text-content tracking-tight">
              Today, {MONTHS[cMonth].slice(0, 3)} {selDay}
            </Text>
            <TouchableOpacity className="bg-brand-light px-3 py-1.5 rounded-full">
              <Text className="text-[10px] font-bold text-brand">Edit Log</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-surface-soft rounded-4xl p-5 border border-line-light">
            <View className="flex-row gap-4 items-start">
              <View className="w-11 h-11 rounded-xl bg-white items-center justify-center shadow-sm">
                <MaterialIcons name="lightbulb" size={22} color="#f90680" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-content mb-1">{getPhaseLabel(phase)}</Text>
                <Text className="text-xs text-black/50 leading-5">{getPhaseInsight(phase)}</Text>
              </View>
            </View>
          </View>

          {/* Chips */}
          <Text className="text-[11px] font-bold text-black/30 tracking-[3px]">LOGGED SYMPTOMS</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { label: "Cramps: Mild", icon: "bolt", bg: "bg-line" },
              { label: "Mood: Happy", icon: "sentiment-satisfied", bg: "bg-amber-100" },
              { label: "Flow: None", icon: "opacity", bg: "bg-blue-100" },
            ].map((c) => (
              <View key={c.label} className="flex-row items-center gap-2 bg-white rounded-full pl-1 pr-4 h-10 border border-black/5 shadow-sm">
                <View className={`w-7 h-7 rounded-full items-center justify-center ${c.bg}`}>
                  <MaterialIcons name={c.icon as any} size={14} color={c.icon === "bolt" ? "#f90680" : c.icon === "sentiment-satisfied" ? "#d97706" : "#2563eb"} />
                </View>
                <Text className="text-sm font-semibold text-content">{c.label}</Text>
              </View>
            ))}
          </View>

          {/* Tracking Bars */}
          {[
            { icon: "water-drop", title: "Water Intake", val: "8/10 glasses", pct: 80, color: "#3b82f6" },
            { icon: "bedtime", title: "Sleep", val: "7.5/8 hrs", pct: 93, color: "#6366f1" },
          ].map((t) => (
            <View key={t.title} className="bg-white rounded-4xl p-4 border border-black/5 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name={t.icon as any} size={20} color={t.color} />
                  <Text className="text-sm font-bold text-content">{t.title}</Text>
                </View>
                <Text className="text-xs font-bold text-brand">{t.val}</Text>
              </View>
              <View className="h-2.5 rounded-full bg-black/5 overflow-hidden">
                <View className="h-full rounded-full" style={{ width: `${t.pct}%` as any, backgroundColor: t.color }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
