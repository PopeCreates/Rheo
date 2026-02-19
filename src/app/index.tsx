import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useApp } from "@/context/AppContext";

export default function Index() {
  const router = useRouter();
  const { onboardingComplete } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(onboardingComplete ? "/(tabs)" : "/onboarding/welcome");
    }, 400);
    return () => clearTimeout(t);
  }, [onboardingComplete]);

  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator size="large" color="#f90680" />
    </View>
  );
}
