import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";
import {
  getMonthDays,
  getCycleDay,
  getCyclePhase,
  getPhaseLabel,
  getPhaseInsight,
  isPeriodDay,
  isFertileDay,
  isOvulationDay,
  isPredictedPeriod,
} from "@/utils/cycle";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarScreen() {
  const router = useRouter();
  const { onboardingData } = useApp();
  const lastPeriod =
    onboardingData.lastPeriodDate || new Date().toISOString().split("T")[0];
  const cycleLen = onboardingData.cycleLength || 28;
  const today = new Date();
  const [cMonth, setCMonth] = useState(today.getMonth());
  const [cYear, setCYear] = useState(today.getFullYear());
  const [selDay, setSelDay] = useState(today.getDate());

  const { firstDay, daysInMonth } = getMonthDays(cYear, cMonth);
  const cycleDay = getCycleDay(lastPeriod, cycleLen);
  const phase = getCyclePhase(cycleDay, cycleLen);

  const prev = () => {
    if (cMonth === 0) {
      setCMonth(11);
      setCYear(cYear - 1);
    } else {
      setCMonth(cMonth - 1);
    }
  };

  const next = () => {
    if (cMonth === 11) {
      setCMonth(0);
      setCYear(cYear + 1);
    } else {
      setCMonth(cMonth + 1);
    }
  };

  const isTd = (d: number) =>
    d === today.getDate() &&
    cMonth === today.getMonth() &&
    cYear === today.getFullYear();

  const renderDay = (day: number) => {
    const period = isPeriodDay(day, cMonth, cYear, lastPeriod, cycleLen);
    const fertile = isFertileDay(day, cMonth, cYear, lastPeriod, cycleLen);
    const ovul = isOvulationDay(day, cMonth, cYear, lastPeriod, cycleLen);
    const predicted = isPredictedPeriod(day, cMonth, cYear, lastPeriod, cycleLen);
    const td = isTd(day);
    const selected = selDay === day;

    // Period day
    if (period) {
      return (
        <TouchableOpacity
          key={day}
          className="w-[14.28%] h-14 items-center justify-center"
          onPress={() => setSelDay(day)}
        >
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              td ? "bg-slate-900" : "bg-rose-500"
            }`}
          >
            <Text className="text-sm font-bold text-white">{day}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Predicted period
    if (predicted) {
      return (
        <TouchableOpacity
          key={day}
          className="w-[14.28%] h-14 items-center justify-center"
          onPress={() => setSelDay(day)}
        >
          <View className="w-10 h-10 rounded-full border-2 border-dashed border-rose-300 items-center justify-center">
            <Text className="text-sm font-semibold text-rose-400">{day}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Fertile window
    if (fertile) {
      return (
        <TouchableOpacity
          key={day}
          className="w-[14.28%] h-14 items-center justify-center bg-primary/10"
          onPress={() => setSelDay(day)}
        >
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              ovul ? "border-2 border-primary bg-white" : ""
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                ovul ? "text-rose-500" : "text-slate-700"
              }`}
            >
              {day}
            </Text>
          </View>
          {ovul && (
            <View className="absolute bottom-1">
              <MaterialIcons name="favorite" size={8} color={Colors.rose[500]} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Today
    if (td) {
      return (
        <TouchableOpacity
          key={day}
          className="w-[14.28%] h-14 items-center justify-center"
          onPress={() => setSelDay(day)}
        >
          <View className="w-10 h-10 rounded-full bg-slate-900 items-center justify-center">
            <Text className="text-sm font-bold text-white">{day}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Regular day
    return (
      <TouchableOpacity
        key={day}
        className="w-[14.28%] h-14 items-center justify-center"
        onPress={() => setSelDay(day)}
      >
        <Text
          className={`text-sm font-medium ${
            selected ? "text-rose-500 font-bold" : "text-slate-700"
          }`}
        >
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-3 bg-white border-b border-rose-100">
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={Colors.slate[800]} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800 uppercase tracking-widest">
          Rheo Calendar
        </Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <MaterialIcons name="more-horiz" size={24} color={Colors.slate[800]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Selector */}
        <View className="flex-row items-center justify-between px-6 py-6">
          <TouchableOpacity
            className="p-2 rounded-full bg-rose-50"
            onPress={prev}
          >
            <MaterialIcons name="chevron-left" size={24} color={Colors.rose[500]} />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">
              Current Cycle
            </Text>
            <Text className="text-xl font-bold text-slate-800">
              {MONTHS[cMonth]} {cYear}
            </Text>
          </View>
          <TouchableOpacity
            className="p-2 rounded-full bg-rose-50"
            onPress={next}
          >
            <MaterialIcons name="chevron-right" size={24} color={Colors.rose[500]} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View className="mx-4 bg-white border border-rose-100 rounded-2xl p-3"
          style={{
            shadowColor: Colors.rose[200],
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {/* Day headers */}
          <View className="flex-row mb-2">
            {DAYS.map((d, i) => (
              <Text
                key={i}
                className="flex-1 text-center text-[10px] font-bold text-rose-300 uppercase"
              >
                {d}
              </Text>
            ))}
          </View>

          {/* Days grid */}
          <View className="flex-row flex-wrap">
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`e-${i}`} className="w-[14.28%] h-14" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) =>
              renderDay(i + 1)
            )}
          </View>
        </View>

        {/* Legend */}
        <View className="px-6 py-5">
          <Text className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
            Calendar Legend
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded-full bg-rose-500" />
              <Text className="text-xs text-slate-500 font-medium">
                Period Days
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded-full bg-primary/30" />
              <Text className="text-xs text-slate-500 font-medium">
                Fertile Window
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 rounded-full border-2 border-dashed border-rose-300" />
              <Text className="text-xs text-slate-500 font-medium">
                Predicted
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="pets" size={14} color={Colors.rose[500]} />
              <Text className="text-xs text-slate-500 font-medium">
                Mood Logged
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Day Info */}
        <View className="px-4">
          <View
            className="bg-rose-50 rounded-3xl p-5 border border-rose-100"
          >
            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center"
                style={{
                  shadowColor: Colors.rose[200],
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                <MaterialIcons name="lightbulb" size={24} color={Colors.rose[500]} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-800 mb-1">
                  {getPhaseLabel(phase)}
                </Text>
                <Text className="text-xs text-slate-500 leading-5">
                  {getPhaseInsight(phase)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Add Entry Button */}
        <View className="px-4 pt-6">
          <TouchableOpacity
            className="bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2"
            onPress={() => router.push("/log-modal")}
            style={{
              shadowColor: Colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <MaterialIcons name="add" size={22} color={Colors.rose[900]} />
            <Text className="text-rose-900 font-bold text-base">
              Add Daily Entry
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
