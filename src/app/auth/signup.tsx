import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, loading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      return;
    }

    try {
      await signUp(email, password, name);
      router.replace("/onboarding/welcome");
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (text: string) => {
    setter(text);
    clearError();
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
          <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">Create account</Text>
          <Text className="text-base text-slate-500 mt-2">
            Join Rheo and start understanding your body.
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
            <Text className="text-sm text-rose-600">{error}</Text>
          </View>
        )}

        <View className="mt-10 gap-4">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Full Name</Text>
            <TextInput
              className="bg-white rounded-xl border border-slate-200 px-4 h-14 text-base text-slate-800"
              placeholder="Your name"
              placeholderTextColor={Colors.slate[400]}
              value={name}
              onChangeText={handleInputChange(setName)}
              autoComplete="name"
              editable={!loading}
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Email</Text>
            <TextInput
              className="bg-white rounded-xl border border-slate-200 px-4 h-14 text-base text-slate-800"
              placeholder="your@email.com"
              placeholderTextColor={Colors.slate[400]}
              value={email}
              onChangeText={handleInputChange(setEmail)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Password</Text>
            <View className="flex-row items-center bg-white rounded-xl border border-slate-200 px-4 h-14">
              <TextInput
                className="flex-1 text-base text-slate-800"
                placeholder="Create a strong password"
                placeholderTextColor={Colors.slate[400]}
                value={password}
                onChangeText={handleInputChange(setPassword)}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color={Colors.slate[400]} />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-slate-400 mt-2">Password must be at least 6 characters</Text>
          </View>
        </View>

        <View className="mt-8">
          <Button 
            title={loading ? "" : "Create Account"} 
            onPress={handleSignUp}
            disabled={loading || !name || !email || !password}
          >
            {loading && <ActivityIndicator color={Colors.rose[900]} />}
          </Button>
        </View>

        <Text className="text-xs text-slate-400 text-center mt-4 leading-5 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>

        <View className="flex-1" />
        <TouchableOpacity 
          className="items-center pb-10" 
          onPress={() => router.push("/auth/login")}
          disabled={loading}
        >
          <Text className="text-sm text-slate-400 font-medium">
            {"Already have an account? "}
            <Text className="text-rose-500 font-semibold">Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
