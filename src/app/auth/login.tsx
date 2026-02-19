import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement actual auth
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity className="mt-14 w-11 h-11 items-center justify-center" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#181114" />
        </TouchableOpacity>

        <View className="mt-8">
          <Text className="text-3xl font-extrabold text-content tracking-tight">Welcome back</Text>
          <Text className="text-base text-content-secondary mt-2">
            Log in to continue tracking your cycle.
          </Text>
        </View>

        {/* Form */}
        <View className="mt-10 gap-4">
          <View>
            <Text className="text-sm font-bold text-content mb-2">Email</Text>
            <TextInput
              className="bg-white rounded-2xl border border-line px-4 h-14 text-base text-content"
              placeholder="your@email.com"
              placeholderTextColor="rgba(24,17,20,0.3)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-content mb-2">Password</Text>
            <View className="flex-row items-center bg-white rounded-2xl border border-line px-4 h-14">
              <TextInput
                className="flex-1 text-base text-content"
                placeholder="Enter your password"
                placeholderTextColor="rgba(24,17,20,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#8c5f75" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="self-end">
            <Text className="text-sm font-semibold text-brand">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Button title="Log In" onPress={handleLogin} />
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-line" />
          <Text className="px-4 text-xs text-content/40 font-medium">OR</Text>
          <View className="flex-1 h-px bg-line" />
        </View>

        {/* Social */}
        <TouchableOpacity className="flex-row items-center justify-center h-14 rounded-full border-2 border-line gap-3">
          <MaterialIcons name="g-mobiledata" size={24} color="#181114" />
          <Text className="font-bold text-content">Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View className="flex-1" />
        <TouchableOpacity
          className="items-center pb-10"
          onPress={() => router.push("/auth/signup")}
        >
          <Text className="text-sm text-content/60 font-semibold">
            {"Don't have an account? "}
            <Text className="text-brand">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
