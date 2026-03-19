import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";

const menuItems = [
  { icon: "person-outline", label: "Edit Profile", color: Colors.rose[500], bg: "bg-rose-50" },
  { icon: "share", label: "Share My Cycle", route: "/share-cycle", color: Colors.indigo[500], bg: "bg-indigo-50" },
  { icon: "restaurant", label: "My Cravings", route: "/cravings", color: Colors.warning, bg: "bg-amber-50" },
  { icon: "people-outline", label: "Partner Dashboard", route: "/partner/dashboard", color: Colors.rose[500], bg: "bg-rose-50" },
  { icon: "card-giftcard", label: "Gift Store", route: "/partner/gift-selection", color: Colors.success, bg: "bg-emerald-50" },
  { icon: "insights", label: "My Insights", route: "/(tabs)/insights", color: Colors.info, bg: "bg-blue-50" },
  { icon: "notifications-none", label: "Notifications", color: Colors.slate[500], bg: "bg-slate-100" },
  { icon: "lock-outline", label: "Privacy & Security", color: Colors.slate[500], bg: "bg-slate-100" },
  { icon: "help-outline", label: "Help & Support", color: Colors.slate[500], bg: "bg-slate-100" },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, onboardingData, dailyLogs } = useApp();
  const { user, signOut, loading } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/");
            } catch (err) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  const displayName = user?.displayName || userName;
  const email = user?.email || "";

  return (
    <View className="flex-1 bg-background-light">
      <ScrollView contentContainerClassName="pt-16 pb-32" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pb-2">
          <Text className="text-2xl font-extrabold text-slate-800">Profile</Text>
        </View>

        {/* Avatar Card */}
        <View 
          className="mx-5 mt-4 bg-white rounded-3xl p-6 border border-slate-100"
          style={{
            shadowColor: Colors.rose[200],
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View className="flex-row items-center gap-4">
            <View 
              className="w-16 h-16 rounded-full bg-primary items-center justify-center"
              style={{
                shadowColor: Colors.primary,
                shadowOpacity: 0.4,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Text className="text-2xl font-bold text-rose-900">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-slate-800">{displayName}</Text>
              {email ? (
                <Text className="text-sm text-slate-500 mt-0.5">{email}</Text>
              ) : (
                <Text className="text-sm text-slate-500 mt-0.5 capitalize">
                  {onboardingData.goal?.replace("_", " ") || "Track Cycle"}
                </Text>
              )}
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center">
              <MaterialIcons name="edit" size={20} color={Colors.rose[500]} />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View className="flex-row items-center justify-around mt-6 pt-6 border-t border-slate-100">
            {[
              { n: onboardingData.cycleLength || 28, l: "Cycle Days" }, 
              { n: dailyLogs.length, l: "Days Logged" }, 
              { n: 5, l: "Period Days" }
            ].map((s, i) => (
              <View key={s.l} className="items-center">
                <Text className="text-2xl font-extrabold text-rose-500">{s.n}</Text>
                <Text className="text-xs text-slate-400 font-medium mt-1">{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Status */}
        {!user && (
          <TouchableOpacity 
            className="mx-5 mt-4 p-4 bg-indigo-50 rounded-2xl flex-row items-center gap-3 border border-indigo-100"
            onPress={() => router.push("/auth/signup")}
          >
            <View className="w-10 h-10 rounded-xl bg-indigo-100 items-center justify-center">
              <MaterialIcons name="cloud-upload" size={20} color={Colors.indigo[500]} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-indigo-700">Sync your data</Text>
              <Text className="text-xs text-indigo-500">Create an account to backup and sync</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.indigo[400]} />
          </TouchableOpacity>
        )}

        {/* Menu */}
        <View className="mt-6 px-5 gap-2">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Settings
          </Text>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center justify-between bg-white rounded-2xl p-4 border border-slate-100"
              onPress={() => (item as any).route && router.push((item as any).route)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <View className={`w-10 h-10 rounded-xl items-center justify-center ${item.bg}`}>
                  <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text className="text-base font-semibold text-slate-700">{item.label}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.slate[300]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out / Sign In */}
        {user ? (
          <TouchableOpacity 
            className="mx-5 mt-6 p-4 rounded-2xl bg-rose-50 items-center flex-row justify-center gap-2"
            onPress={handleSignOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.rose[500]} />
            ) : (
              <>
                <MaterialIcons name="logout" size={20} color={Colors.rose[500]} />
                <Text className="text-base font-bold text-rose-500">Sign Out</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            className="mx-5 mt-6 p-4 rounded-2xl bg-slate-900 items-center flex-row justify-center gap-2"
            onPress={() => router.push("/auth/login")}
          >
            <MaterialIcons name="login" size={20} color={Colors.white} />
            <Text className="text-base font-bold text-white">Sign In</Text>
          </TouchableOpacity>
        )}

        <Text className="text-center text-xs text-slate-300 mt-6">Rheo v1.0.0</Text>
      </ScrollView>
    </View>
  );
}
