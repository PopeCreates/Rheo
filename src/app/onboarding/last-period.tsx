import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Button } from "@/components/ui/Button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useApp } from "@/context/AppContext";
import { getMonthDays } from "@/utils/cycle";
import { Colors } from "@/constants/colors";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function LastPeriodScreen() {
  const router = useRouter();
  const { setOnboardingData } = useApp();
  const [selectedDay, setSelectedDay] = useState<number | null>(5);
  const [dontRemember, setDontRemember] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { firstDay, daysInMonth } = getMonthDays(currentYear, currentMonth);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
    setSelectedDay(null);
  };

  const handleNext = () => {
    if (selectedDay && !dontRemember) {
      const date = new Date(currentYear, currentMonth, selectedDay);
      setOnboardingData({ lastPeriodDate: date.toISOString().split("T")[0] });
    }
    router.push("/onboarding/select-goal");
  };

  return (
    <View className="flex-1 bg-background-light pt-12">
      <Header showBack stepText="Step 1 of 4" />
      <ProgressDots total={4} current={0} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-extrabold text-slate-800 text-center pt-8 tracking-tight">
          When did your last period start?
        </Text>
        <Text className="text-base text-slate-500 text-center mt-3 leading-6">
          Select the first day of your most recent cycle to help us track your health.
        </Text>

        {/* Calendar */}
        <View className="bg-white rounded-3xl p-5 mt-6 border border-slate-100"
          style={{
            shadowColor: Colors.rose[200],
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={prevMonth} className="p-2 rounded-full bg-rose-50">
              <MaterialIcons name="chevron-left" size={24} color={Colors.rose[500]} />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-slate-800">
              {monthNames[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} className="p-2 rounded-full bg-rose-50">
              <MaterialIcons name="chevron-right" size={24} color={Colors.rose[500]} />
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-2">
            {DAYS.map((d, i) => (
              <Text key={i} className="flex-1 text-center text-xs font-bold text-slate-400 tracking-widest">
                {d}
              </Text>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`e-${i}`} className="w-[14.28%] h-12 items-center justify-center" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDay === day && !dontRemember;
              return (
                <TouchableOpacity
                  key={day}
                  className="w-[14.28%] h-12 items-center justify-center"
                  onPress={() => { setSelectedDay(day); setDontRemember(false); }}
                >
                  <View 
                    className={`w-10 h-10 rounded-full items-center justify-center ${isSelected ? "bg-primary" : ""}`}
                    style={isSelected ? {
                      shadowColor: Colors.primary,
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 2 },
                    } : undefined}
                  >
                    <Text className={`text-sm font-semibold ${isSelected ? "text-rose-900" : "text-slate-700"}`}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Don't remember */}
        <View className="flex-row items-center justify-between bg-white rounded-2xl px-5 py-4 mt-6 border border-slate-100">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center">
              <MaterialIcons name="help-outline" size={20} color={Colors.rose[400]} />
            </View>
            <Text className="text-base font-semibold text-slate-700">{"I don't remember"}</Text>
          </View>
          <ToggleSwitch value={dontRemember} onToggle={setDontRemember} />
        </View>
      </ScrollView>

      <View className="px-6 pb-10">
        <Button
          title="Next"
          onPress={handleNext}
          icon={<MaterialIcons name="arrow-forward" size={20} color={Colors.rose[900]} />}
        />
      </View>
    </View>
  );
}
