import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";

export default function ShareCycleScreen() {
  const { partners, updatePartner } = useApp();

  return (
    <View className="flex-1 bg-surface pt-12">
      <Header title="Share My Cycle" showBack />

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-content mt-6 tracking-tight">Shared Partners</Text>
        <Text className="text-sm text-content-secondary mt-2 mb-6 leading-5">
          Keep your loved ones in the loop with your cycle updates.
        </Text>

        {partners.map((p) => (
          <View key={p.id} className="bg-white rounded-3xl p-5 border border-line mb-4 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="w-14 h-14 rounded-full bg-surface-soft items-center justify-center">
                <Text className="text-2xl font-bold text-brand">{p.name.charAt(0)}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-content">{p.name}</Text>
                <Text className="text-xs font-bold text-brand tracking-widest">{p.role.toUpperCase()}</Text>
              </View>
              <TouchableOpacity>
                <MaterialIcons name="settings" size={22} color="rgba(0,0,0,0.3)" />
              </TouchableOpacity>
            </View>

            {[
              { key: "moodSharing" as const, icon: "favorite", label: "Mood Sharing" },
              { key: "periodAlerts" as const, icon: "notifications", label: "Period Alerts" },
            ].map((t) => (
              <View key={t.key} className="flex-row items-center justify-between bg-black/2 rounded-xl px-4 py-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-brand-light items-center justify-center">
                    <MaterialIcons name={t.icon as any} size={18} color="#f90680" />
                  </View>
                  <Text className="text-sm font-semibold text-content">{t.label}</Text>
                </View>
                <ToggleSwitch value={p[t.key]} onToggle={(v) => updatePartner(p.id, { [t.key]: v })} />
              </View>
            ))}
          </View>
        ))}

        {[0, 1].map((i) => (
          <TouchableOpacity key={i} className="items-center justify-center py-8 border-2 border-dashed border-line rounded-3xl mb-4 gap-2">
            <MaterialIcons name="person-add" size={36} color="rgba(249,6,128,0.6)" />
            <Text className="text-base font-bold text-content">Empty Slot</Text>
            <Text className="text-xs text-content-secondary text-center px-6">
              {i === 0 ? "Invite another close friend or family member" : "Invite another person"}
            </Text>
          </TouchableOpacity>
        ))}

        <View className="mt-6">
          <Button
            title="Invite New Person"
            onPress={() => {}}
            icon={<MaterialIcons name="add-circle" size={22} color="#fff" />}
          />
        </View>

        <Text className="text-xs text-content-muted text-center mt-6 leading-5 px-5 mb-10">
          Your health data is private. Partners can only see what you choose to share and you can revoke access at any time.
        </Text>
      </ScrollView>
    </View>
  );
}
