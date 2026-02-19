import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import type { MoodType, SymptomType, FlowIntensity, MoodOption, SymptomOption } from "@/types/interface";

const moods: MoodOption[] = [
  { id: "happy", label: "Happy", icon: "sentiment-very-satisfied" },
  { id: "sensitive", label: "Sensitive", icon: "auto-awesome" },
  { id: "tired", label: "Tired", icon: "bedtime" },
  { id: "anxious", label: "Anxious", icon: "cloud" },
  { id: "calm", label: "Calm", icon: "eco" },
  { id: "other", label: "Other", icon: "add" },
];

const symptoms: SymptomOption[] = [
  { id: "bloating", label: "Bloating", icon: "air" },
  { id: "headache", label: "Headache", icon: "psychology" },
  { id: "acne", label: "Acne", icon: "flare" },
  { id: "cramps", label: "Cramps", icon: "waves" },
  { id: "backache", label: "Backache", icon: "accessibility-new" },
  { id: "spotting", label: "Spotting", icon: "water-drop" },
];

export default function DailyLogScreen() {
  const router = useRouter();
  const { saveDailyLog } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>("happy");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>(["headache", "cramps"]);
  const [flowLevel] = useState(50);
  const [notes, setNotes] = useState("");

  const toggleSymptom = (id: SymptomType) =>
    setSelectedSymptoms((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const getFlowLabel = (): FlowIntensity => {
    if (flowLevel <= 15) return "none";
    if (flowLevel <= 45) return "light";
    if (flowLevel <= 75) return "medium";
    return "heavy";
  };

  const handleSave = () => {
    saveDailyLog({
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      flow: getFlowLabel(),
      symptoms: selectedSymptoms,
      notes,
      waterIntake: 8,
      sleepHours: 7.5,
    });
    Alert.alert("Saved!", "Your daily entry has been saved.");
  };

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-surface/80">
        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#181114" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-lg font-bold text-content tracking-tight">Daily Logger</Text>
          <Text className="text-xs font-semibold text-brand">
            Today, {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="calendar-today" size={20} color="#181114" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Mood */}
        <View className="flex-row justify-between items-center pt-6 pb-2">
          <Text className="text-xl font-extrabold text-content tracking-tight">{"How's your mood?"}</Text>
          <Text className="text-xs font-medium text-brand">Select one</Text>
        </View>
        <View className="flex-row flex-wrap gap-3 py-4">
          {moods.map((m) => {
            const sel = selectedMood === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                className={`w-[30%] items-center gap-2 rounded-2xl border py-4 ${sel ? "border-2 border-brand bg-brand-light/50" : "border-line bg-white"}`}
                onPress={() => setSelectedMood(m.id)}
              >
                <MaterialIcons name={m.icon as any} size={28} color={sel ? "#f90680" : "rgba(249,6,128,0.6)"} />
                <Text className="text-xs font-bold text-content">{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Flow Intensity */}
        <Text className="text-xl font-extrabold text-content tracking-tight pt-6 pb-2">Flow Intensity</Text>
        <View className="bg-white rounded-2xl border border-line p-6 my-4">
          <View className="h-2 bg-brand-light rounded-full relative mb-8">
            <View className="absolute left-0 top-0 h-2 bg-brand rounded-full" style={{ width: `${flowLevel}%` as any }} />
            <View className="absolute -top-2.25 w-6.5 h-6.5 rounded-full bg-white border-4 border-brand shadow" style={{ left: `${flowLevel}%` as any, marginLeft: -13 }} />
          </View>
          <View className="flex-row justify-between">
            {["NONE", "MEDIUM", "HEAVY"].map((l, i) => (
              <Text key={l} className={`text-xs font-bold tracking-widest ${i === 1 && flowLevel > 35 && flowLevel <= 65 ? "text-brand" : flowLevel <= 15 && i === 0 ? "text-brand" : flowLevel > 75 && i === 2 ? "text-brand" : "text-black/30"}`}>{l}</Text>
            ))}
          </View>
        </View>

        {/* Symptoms */}
        <Text className="text-xl font-extrabold text-content tracking-tight pt-6 pb-2">Symptoms</Text>
        <View className="flex-row flex-wrap gap-3 py-4">
          {symptoms.map((s) => {
            const sel = selectedSymptoms.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                className={`w-[47%] flex-row items-center gap-3 rounded-2xl border p-4 ${sel ? "border-brand bg-brand-light/50" : "border-line bg-white"}`}
                onPress={() => toggleSymptom(s.id)}
              >
                <MaterialIcons name={s.icon as any} size={22} color="#f90680" />
                <Text className="text-base font-bold text-content">{s.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notes */}
        <Text className="text-xl font-extrabold text-content tracking-tight pt-6 pb-2">Personal Notes</Text>
        <TextInput
          className="bg-white rounded-2xl border border-line p-4 h-32 text-sm text-content mt-4"
          placeholder="How was your day? Write down any thoughts..."
          placeholderTextColor="rgba(24,17,20,0.3)"
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />

      </ScrollView>

      {/* Save */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-10 bg-surface">
        <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-brand h-14 rounded-full shadow-lg shadow-brand/30" onPress={handleSave}>
          <Text className="text-white text-base font-extrabold">Save Daily Entry</Text>
          <MaterialIcons name="check-circle" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
