import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import type { CravingCategory } from "@/types/interface";

const categories: { id: CravingCategory; label: string; icon: string }[] = [
  { id: "sweet", label: "Sweet", icon: "cake" },
  { id: "salty", label: "Salty", icon: "bakery-dining" },
  { id: "cool", label: "Cool", icon: "local-cafe" },
  { id: "savory", label: "Savory", icon: "local-pizza" },
];

const cravingsData = [
  { id: "1", name: "Double Burger", desc: "Juicy & Cheesy", icon: "lunch-dining" },
  { id: "2", name: "Dark Chocolate", desc: "Rich & Velvety", icon: "cookie" },
  { id: "3", name: "Boba Tea", desc: "Extra Pearls", icon: "local-cafe" },
  { id: "4", name: "Soft Blanket", desc: "Warm & Cozy", icon: "nights-stay" },
];

export default function CravingsScreen() {
  const router = useRouter();
  const [notifyPartners, setNotifyPartners] = useState(true);
  const [selectedCat, setSelectedCat] = useState<CravingCategory>("sweet");
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [toast, setToast] = useState(false);

  const toggle = (id: string) => {
    setAddedItems((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
    if (notifyPartners) { setToast(true); setTimeout(() => setToast(false), 3000); }
  };

  return (
    <View className="flex-1 bg-surface pt-12">
      <Header title="My Cravings" showBack rightAction={
        <TouchableOpacity><MaterialIcons name="favorite" size={24} color="#f90680" /></TouchableOpacity>
      } />

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Notify */}
        <View className="bg-white rounded-3xl p-5 flex-row justify-between items-center mt-4 border border-line shadow-sm">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-content">Notify Partners</Text>
              <MaterialIcons name="auto-awesome" size={18} color="#f90680" />
            </View>
            <Text className="text-xs text-content-secondary mt-0.5">Instantly share your desires with loved ones</Text>
          </View>
          <ToggleSwitch value={notifyPartners} onToggle={setNotifyPartners} />
        </View>

        {/* Categories */}
        <Text className="text-xl font-extrabold text-content tracking-tight mt-6 mb-3">{"Feeling..."}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 py-1">
          {categories.map((c) => {
            const sel = selectedCat === c.id;
            return (
              <TouchableOpacity key={c.id} className="items-center gap-2" onPress={() => setSelectedCat(c.id)}>
                <View className={`w-16 h-16 rounded-full items-center justify-center border-2 ${sel ? "border-brand bg-brand-light" : "border-line bg-white"}`}>
                  <MaterialIcons name={c.icon as any} size={28} color={sel ? "#f90680" : "#8c5f75"} />
                </View>
                <Text className={`text-xs font-semibold ${sel ? "text-brand font-bold" : "text-content-secondary"}`}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Grid */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xl font-extrabold text-content tracking-tight">{"Today's Desires"}</Text>
          <TouchableOpacity><Text className="text-sm font-bold text-brand">Clear all</Text></TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap gap-4 mt-3">
          {cravingsData.map((item) => {
            const added = addedItems.includes(item.id);
            return (
              <View key={item.id} className="bg-white rounded-2xl overflow-hidden border border-line w-[47%]">
                <View className="w-full h-36 bg-surface-soft items-center justify-center relative">
                  <MaterialIcons name={item.icon as any} size={48} color="#f90680" />
                  <View className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white items-center justify-center shadow-sm">
                    <MaterialIcons name={item.icon as any} size={14} color="#f90680" />
                  </View>
                </View>
                <Text className="text-base font-bold text-content px-3 pt-3">{item.name}</Text>
                <Text className="text-xs text-content-secondary px-3 pt-0.5">{item.desc}</Text>
                <TouchableOpacity
                  className={`flex-row items-center justify-center gap-1 mx-3 my-3 rounded-full py-2 ${added ? "bg-accent-green" : "bg-brand"}`}
                  onPress={() => toggle(item.id)}
                >
                  <MaterialIcons name={added ? "check" : "add"} size={16} color="#fff" />
                  <Text className="text-white text-xs font-bold">{added ? "Added" : "Add to List"}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Custom */}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 bg-brand-light rounded-full py-4 mt-6 border border-dashed border-brand"
          onPress={() => router.push("/add-craving")}
        >
          <MaterialIcons name="add-circle-outline" size={22} color="#f90680" />
          <Text className="text-base font-bold text-brand">Add Custom Craving</Text>
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>

      {toast && (
        <View className="absolute bottom-8 left-4 right-4 flex-row items-center gap-2 bg-content/90 rounded-full px-5 py-3">
          <MaterialIcons name="check-circle" size={20} color="#22c55e" />
          <Text className="flex-1 text-white text-sm font-semibold">Partner notified!</Text>
          <TouchableOpacity onPress={() => setToast(false)}>
            <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
