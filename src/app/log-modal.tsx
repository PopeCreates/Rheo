import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";
import type {
  MoodType,
  SymptomType,
  FlowIntensity,
  MoodOption,
  SymptomOption,
} from "@/types/interface";

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

const flowLevels: { id: FlowIntensity; label: string }[] = [
  { id: "none", label: "None" },
  { id: "light", label: "Light" },
  { id: "medium", label: "Medium" },
  { id: "heavy", label: "Heavy" },
];

export default function LogModalScreen() {
  const router = useRouter();
  const { saveDailyLog } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<FlowIntensity>("none");
  const [notes, setNotes] = useState("");

  const toggleSymptom = (id: SymptomType) =>
    setSelectedSymptoms((p) =>
      p.includes(id) ? p.filter((s) => s !== id) : [...p, id]
    );

  const handleSave = () => {
    saveDailyLog({
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      flow: selectedFlow,
      symptoms: selectedSymptoms,
      notes,
      waterIntake: 8,
      sleepHours: 7.5,
    });
    Alert.alert("Saved!", "Your daily entry has been saved.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View className="flex-1 bg-background-light">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4 bg-white/90 border-b border-rose-100">
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={22} color={Colors.slate[600]} />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-lg font-extrabold text-slate-800">
            Daily Log
          </Text>
          <Text className="text-xs font-bold text-rose-500">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        <TouchableOpacity
          className="px-4 py-2 bg-primary rounded-full"
          onPress={handleSave}
        >
          <Text className="text-sm font-bold text-rose-900">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Section */}
        <View className="pt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-extrabold text-slate-800">
              How are you feeling?
            </Text>
            <Text className="text-xs font-bold text-rose-400">Select one</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {moods.map((m) => {
              const sel = selectedMood === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  className={`w-[30%] items-center gap-2 rounded-2xl border py-4 ${
                    sel
                      ? "border-2 border-primary bg-rose-50"
                      : "border-slate-100 bg-white"
                  }`}
                  onPress={() => setSelectedMood(m.id)}
                  style={
                    sel
                      ? {
                          shadowColor: Colors.primary,
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          shadowOffset: { width: 0, height: 2 },
                        }
                      : undefined
                  }
                >
                  <MaterialIcons
                    name={m.icon as any}
                    size={28}
                    color={sel ? Colors.rose[500] : Colors.slate[400]}
                  />
                  <Text
                    className={`text-xs font-bold ${
                      sel ? "text-rose-500" : "text-slate-600"
                    }`}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Flow Section */}
        <View className="pt-8">
          <Text className="text-xl font-extrabold text-slate-800 mb-4">
            Flow Intensity
          </Text>

          <View className="flex-row gap-3">
            {flowLevels.map((f) => {
              const sel = selectedFlow === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  className={`flex-1 items-center py-4 rounded-2xl border ${
                    sel
                      ? "border-2 border-primary bg-rose-50"
                      : "border-slate-100 bg-white"
                  }`}
                  onPress={() => setSelectedFlow(f.id)}
                >
                  <Text
                    className={`text-sm font-bold ${
                      sel ? "text-rose-500" : "text-slate-600"
                    }`}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Symptoms Section */}
        <View className="pt-8">
          <Text className="text-xl font-extrabold text-slate-800 mb-4">
            Symptoms
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {symptoms.map((s) => {
              const sel = selectedSymptoms.includes(s.id);
              return (
                <TouchableOpacity
                  key={s.id}
                  className={`w-[47%] flex-row items-center gap-3 rounded-2xl border p-4 ${
                    sel
                      ? "border-primary bg-rose-50"
                      : "border-slate-100 bg-white"
                  }`}
                  onPress={() => toggleSymptom(s.id)}
                >
                  <View
                    className={`w-10 h-10 rounded-xl items-center justify-center ${
                      sel ? "bg-primary" : "bg-slate-100"
                    }`}
                  >
                    <MaterialIcons
                      name={s.icon as any}
                      size={20}
                      color={sel ? Colors.rose[900] : Colors.slate[400]}
                    />
                  </View>
                  <Text
                    className={`text-sm font-bold ${
                      sel ? "text-rose-500" : "text-slate-600"
                    }`}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notes Section */}
        <View className="pt-8">
          <Text className="text-xl font-extrabold text-slate-800 mb-4">
            Notes
          </Text>

          <TextInput
            className="bg-white rounded-2xl border border-slate-100 p-4 h-28 text-sm text-slate-700"
            placeholder="How was your day? Any thoughts..."
            placeholderTextColor={Colors.slate[400]}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </View>
  );
}
