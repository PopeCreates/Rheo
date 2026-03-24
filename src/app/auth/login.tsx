import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithTwitter, loading, error, clearError } = useAuth();
  const [socialLoading, setSocialLoading] = useState<"google" | "twitter" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleForgotPassword = () => {
    if (email) {
      Alert.alert(
        "Reset Password",
        `We'll send a password reset link to ${email}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Send", onPress: () => {} }, // TODO: Implement password reset
        ]
      );
    } else {
      Alert.alert("Enter Email", "Please enter your email address first.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading("google");
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setSocialLoading(null);
    }
  };

  const handleTwitterSignIn = async () => {
    try {
      setSocialLoading("twitter");
      await signInWithTwitter();
      router.replace("/(tabs)");
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setSocialLoading(null);
    }
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

        {/* Error Message */}
        {error && (
          <View className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
            <Text className="text-sm text-rose-600">{error}</Text>
          </View>
        )}

        {/* Form */}
        <View className="mt-10 gap-4">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-2">Email</Text>
            <TextInput
              className="bg-white rounded-xl border border-slate-200 px-4 h-14 text-base text-slate-800"
              placeholder="your@email.com"
              placeholderTextColor={Colors.slate[400]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
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
                placeholder="Enter your password"
                placeholderTextColor={Colors.slate[400]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError();
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color={Colors.slate[400]} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="self-end" onPress={handleForgotPassword}>
            <Text className="text-sm font-semibold text-rose-500">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Button 
            title={loading ? "" : "Log In"} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading && <ActivityIndicator color={Colors.rose[900]} />}
          </Button>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="px-4 text-xs text-slate-400 font-medium uppercase tracking-widest">or</Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>

        {/* Google Sign-In */}
        <TouchableOpacity 
          className="flex-row items-center justify-center h-14 rounded-xl border-2 border-slate-200 gap-3 bg-white"
          onPress={handleGoogleSignIn}
          disabled={loading || socialLoading !== null}
          style={{ opacity: loading || socialLoading !== null ? 0.5 : 1 }}
        >
          {socialLoading === "google" ? (
            <ActivityIndicator color={Colors.slate[600]} />
          ) : (
            <>
              <Image 
                source={{ uri: "https://www.google.com/favicon.ico" }} 
                style={{ width: 20, height: 20 }} 
              />
              <Text className="font-bold text-slate-700">Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* X (Twitter) Sign-In */}
        <TouchableOpacity 
          className="flex-row items-center justify-center h-14 rounded-xl gap-3 bg-black mt-3"
          onPress={handleTwitterSignIn}
          disabled={loading || socialLoading !== null}
          style={{ opacity: loading || socialLoading !== null ? 0.5 : 1 }}
        >
          {socialLoading === "twitter" ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text className="font-bold text-white text-lg">𝕏</Text>
              <Text className="font-bold text-white">Continue with X</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Sign up link */}
        <View className="flex-1" />
        <TouchableOpacity
          className="items-center pb-10"
          onPress={() => router.push("/auth/signup")}
          disabled={loading}
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
