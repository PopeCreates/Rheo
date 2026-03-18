import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-light">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <MaterialIcons name="close" size={28} color={Colors.slate[800]} />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 tracking-tight">
          Rheo
        </Text>
        <View className="w-12" />
      </View>

      {/* Mascot Illustration */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-1 bg-primary/10 rounded-3xl items-center justify-center relative overflow-hidden">
          {/* Gradient overlay */}
          <View className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          
          {/* Bunny mascot placeholder */}
          <View 
            className="w-48 h-48 rounded-full bg-primary/30 items-center justify-center"
            style={{
              shadowColor: Colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 0 },
            }}
          >
            <MaterialIcons name="pets" size={96} color={Colors.rose[400]} />
          </View>
          
          {/* Floating decorative elements */}
          <View className="absolute top-10 left-10 w-4 h-4 rounded-full bg-primary/40" />
          <View className="absolute bottom-20 right-10 w-6 h-6 rounded-full bg-primary/30" />
          <View className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-primary/20" />
        </View>
      </View>

      {/* Text Content */}
      <View className="px-6 py-4">
        <Text className="text-[32px] font-extrabold text-slate-800 text-center tracking-tight leading-tight">
          In sync with your flow
        </Text>
        <Text className="text-base text-slate-500 text-center mt-2 leading-relaxed px-4">
          Personalized insights and cycle tracking designed for your unique rhythm.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="px-6 pb-6 gap-3">
        <Button
          title="Sign Up"
          onPress={() => router.push("/onboarding/last-period")}
        />
        <Button
          title="Log In"
          variant="secondary"
          onPress={() => router.push("/auth/login")}
        />
        
        <View className="flex-row items-center py-3">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="px-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
            or
          </Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>
        
        <Button
          title="Continue with Google"
          variant="outline"
          onPress={() => {}}
          icon={<MaterialIcons name="login" size={20} color={Colors.slate[600]} />}
        />
      </View>

      {/* Footer Policy */}
      <Text className="text-slate-400 text-[13px] text-center px-8 pb-8">
        By continuing, you agree to our{" "}
        <Text className="underline">Terms of Service</Text> and{" "}
        <Text className="underline">Privacy Policy</Text>
      </Text>
    </View>
  );
}
