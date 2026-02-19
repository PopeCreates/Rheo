import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

const menuItems = [
  { icon: "person-outline", label: "Edit Profile" },
  { icon: "share", label: "Share My Cycle", route: "/share-cycle" },
  { icon: "restaurant", label: "My Cravings", route: "/cravings" },
  { icon: "people-outline", label: "Partner Dashboard", route: "/partner/dashboard" },
  { icon: "card-giftcard", label: "Gift Selection", route: "/partner/gift-selection" },
  { icon: "notifications-none", label: "Notification Settings" },
  { icon: "lock-outline", label: "Privacy & Security" },
  { icon: "help-outline", label: "Help & Support" },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, onboardingData, dailyLogs } = useApp();

  return (
    <View className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="pt-20 pb-32" showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View className="items-center py-6">
          <View className="w-20 h-20 rounded-full bg-brand items-center justify-center mb-4 shadow-lg shadow-brand/30">
            <Text className="text-3xl font-bold text-white">{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text className="text-2xl font-extrabold text-content">{userName}</Text>
          <Text className="text-sm text-content-secondary mt-1 capitalize">
            Goal: {onboardingData.goal?.replace("_", " ") || "Track Cycle"}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row items-center justify-around bg-white mx-4 rounded-3xl p-5 shadow-sm border border-line">
          {[{ n: onboardingData.cycleLength, l: "Cycle" }, { n: dailyLogs.length, l: "Logged" }, { n: 5, l: "Period" }].map((s, i) => (
            <React.Fragment key={s.l}>
              {i > 0 && <View className="w-px h-9 bg-line" />}
              <View className="items-center gap-1">
                <Text className="text-2xl font-extrabold text-brand">{s.n}</Text>
                <Text className="text-xs text-content-secondary font-medium">{s.l}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Menu */}
        <View className="mt-6 px-4 gap-1">
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center justify-between bg-white rounded-2xl p-4 border border-line"
              onPress={() => (item as any).route && router.push((item as any).route)}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-brand-light items-center justify-center">
                  <MaterialIcons name={item.icon as any} size={22} color="#f90680" />
                </View>
                <Text className="text-base font-semibold text-content">{item.label}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="rgba(0,0,0,0.2)" />
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-center text-xs text-black/20 mt-8">Her Circle v1.0.0</Text>
      </ScrollView>
    </View>
  );
}
