import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

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
      className="flex-1 bg-background-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity 
          className="mt-14 w-11 h-11 rounded-full bg-white border border-slate-100 items-center justify-center" 
          onPress={() => router.back()}
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <MaterialIcons name="arrow-back-ios" size={18} color={Colors.slate[800]} />
        </TouchableOpacity>

        <View className="mt-8">
          <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back</Text>
          <Text className="text-base text-slate-500 mt-2">
            Log in to continue tracking your cycle.
          </Text>
        </View>

        {/* Form */}
        <View className="mt-10 gap-4">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Email</Text>
            <TextInput
              className="bg-white rounded-xl border border-slate-200 px-4 h-14 text-base text-slate-800"
              placeholder="your@email.com"
              placeholderTextColor={Colors.slate[400]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Password</Text>
            <View className="flex-row items-center bg-white rounded-xl border border-slate-200 px-4 h-14">
              <TextInput
                className="flex-1 text-base text-slate-800"
                placeholder="Enter your password"
                placeholderTextColor={Colors.slate[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color={Colors.slate[400]} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="self-end">
            <Text className="text-sm font-semibold text-rose-500">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Button title="Log In" onPress={handleLogin} />
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="px-4 text-xs text-slate-400 font-medium uppercase tracking-widest">or</Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>

        {/* Social */}
        <TouchableOpacity className="flex-row items-center justify-center h-14 rounded-xl border-2 border-slate-200 gap-3 bg-white">
          <MaterialIcons name="login" size={20} color={Colors.slate[600]} />
          <Text className="font-bold text-slate-700">Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View className="flex-1" />
        <TouchableOpacity
          className="items-center pb-10"
          onPress={() => router.push("/auth/signup")}
        >
          <Text className="text-sm text-slate-400 font-medium">
            {"Don't have an account? "}
            <Text className="text-rose-500 font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
