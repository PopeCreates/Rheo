import React, { useState } from "react";
import { View, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";

export default function CycleLengthScreen() {
  const router = useRouter();
  const { setOnboardingData, onboardingData } = useApp();
  const [cycleLength, setCycleLength] = useState(onboardingData.cycleLength || 28);

  const pct = ((cycleLength - 21) / (45 - 21)) * 100;

  const handleContinue = () => {
    setOnboardingData({ cycleLength });
    router.push("/onboarding/notifications");
  };

  return (
    <View className="flex-1 bg-background-light pt-12">
      <Header showBack stepText="Step 3 of 4" />
      <ProgressDots total={4} current={2} />

      <View className="flex-1 px-6">
        <Text className="text-3xl font-extrabold text-slate-800 text-center pt-6 tracking-tight">
          How long is your cycle usually?
        </Text>
        <Text className="text-base text-slate-500 text-center mt-2 leading-6 px-4">
          Knowing your cycle length helps us predict your fertile window and next period accurately.
        </Text>

        {/* Value Display */}
        <View className="items-center justify-center py-12">
          <View 
            className="bg-white rounded-3xl px-12 py-8 items-center border border-slate-100"
            style={{
              shadowColor: Colors.rose[200],
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text className="text-6xl font-extrabold text-rose-500 tracking-tight">{cycleLength}</Text>
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-[3px] mt-2">Days</Text>
          </View>
        </View>

        {/* Custom Slider */}
        <View className="px-4 relative">
          <View className="h-3 bg-rose-100 rounded-full relative">
            <View className="absolute left-0 top-0 h-3 bg-primary rounded-full" style={{ width: `${pct}%` as any }} />
            <View
              className="absolute -top-2.5 w-8 h-8 rounded-full bg-white border-4 border-primary"
              style={{ 
                left: `${pct}%` as any, 
                marginLeft: -16,
                shadowColor: Colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
            />
          </View>
          <View className="flex-row justify-between mt-6">
            <Text className="text-xs text-slate-400 font-semibold">21 Days</Text>
            <Text className="text-xs text-slate-400 font-semibold">30 Days</Text>
            <Text className="text-xs text-slate-400 font-semibold">45 Days</Text>
          </View>
          {Platform.OS === "web" && (
            <input
              type="range"
              min={21}
              max={45}
              value={cycleLength}
              onChange={(e: any) => setCycleLength(Number(e.target.value))}
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, opacity: 0, cursor: "pointer" }}
            />
          )}
        </View>

        <Text className="text-sm text-slate-400 text-center mt-10">
          {"Don't worry, you can always change this later in settings."}
        </Text>
      </View>

      <View className="px-6 pb-10">
        <Button
          title="Continue"
          onPress={handleContinue}
          icon={<MaterialIcons name="arrow-forward" size={20} color={Colors.rose[900]} />}
        />
      </View>
    </View>
  );
}
