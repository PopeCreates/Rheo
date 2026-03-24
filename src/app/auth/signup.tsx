import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithTwitter, loading, error, clearError } = useAuth();
  const [socialLoading, setSocialLoading] = useState<"google" | "twitter" | null>(null);
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

  const handleGoogleSignUp = async () => {
    try {
      setSocialLoading("google");
      await signInWithGoogle();
      router.replace("/onboarding/welcome");
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setSocialLoading(null);
    }
  };

  const handleTwitterSignUp = async () => {
    try {
      setSocialLoading("twitter");
      await signInWithTwitter();
      router.replace("/onboarding/welcome");
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

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="px-4 text-xs text-slate-400 font-medium uppercase tracking-widest">or</Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>

        {/* Google Sign-Up */}
        <TouchableOpacity 
          className="flex-row items-center justify-center h-14 rounded-xl border-2 border-slate-200 gap-3 bg-white"
          onPress={handleGoogleSignUp}
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
              <Text className="font-bold text-slate-700">Sign up with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* X (Twitter) Sign-Up */}
        <TouchableOpacity 
          className="flex-row items-center justify-center h-14 rounded-xl gap-3 bg-black mt-3"
          onPress={handleTwitterSignUp}
          disabled={loading || socialLoading !== null}
          style={{ opacity: loading || socialLoading !== null ? 0.5 : 1 }}
        >
          {socialLoading === "twitter" ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text className="font-bold text-white text-lg">𝕏</Text>
              <Text className="font-bold text-white">Sign up with X</Text>
            </>
          )}
        </TouchableOpacity>

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
