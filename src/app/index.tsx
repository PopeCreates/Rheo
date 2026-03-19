import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Colors } from "@/constants/colors";

export default function Index() {
  const router = useRouter();
  const { onboardingComplete } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(onboardingComplete ? "/(tabs)" : "/onboarding/welcome");
    }, 1200);
    return () => clearTimeout(t);
  }, [onboardingComplete]);

  return (
    <View className="flex-1 items-center justify-center bg-background-light">
      {/* Bunny mascot placeholder */}
      <View 
        className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center mb-8"
        style={{
          shadowColor: Colors.primary,
          shadowOpacity: 0.3,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <MaterialIcons name="pets" size={64} color={Colors.rose[400]} />
      </View>
      
      <Text className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
        Rheo
      </Text>
      <Text className="text-sm text-rose-400 font-medium">
        In sync with your flow
      </Text>
      
      <View className="mt-8">
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    </View>
  );
}
