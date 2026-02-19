import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // TODO: Implement actual auth
    router.replace("/onboarding/welcome");
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
        <TouchableOpacity className="mt-14 w-11 h-11 items-center justify-center" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#181114" />
        </TouchableOpacity>

        <View className="mt-8">
          <Text className="text-3xl font-extrabold text-content tracking-tight">Create account</Text>
          <Text className="text-base text-content-secondary mt-2">
            Join Her Circle and start understanding your body.
          </Text>
        </View>

        <View className="mt-10 gap-4">
          <View>
            <Text className="text-sm font-bold text-content mb-2">Full Name</Text>
            <TextInput
              className="bg-white rounded-2xl border border-line px-4 h-14 text-base text-content"
              placeholder="Your name"
              placeholderTextColor="rgba(24,17,20,0.3)"
              value={name}
              onChangeText={setName}
            />
          </View>

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
            <TextInput
              className="bg-white rounded-2xl border border-line px-4 h-14 text-base text-content"
              placeholder="Create a strong password"
              placeholderTextColor="rgba(24,17,20,0.3)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View className="mt-8">
          <Button title="Create Account" onPress={handleSignUp} />
        </View>

        <Text className="text-xs text-content/40 text-center mt-4 leading-5 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>

        <View className="flex-1" />
        <TouchableOpacity className="items-center pb-10" onPress={() => router.push("/auth/login")}>
          <Text className="text-sm text-content/60 font-semibold">
            {"Already have an account? "}
            <Text className="text-brand">Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
