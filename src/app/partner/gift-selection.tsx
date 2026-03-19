import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import type { GiftCategory } from "@/types/interface";

const tabs: { id: GiftCategory; label: string; icon: string }[] = [
  { id: "flowers", label: "Flowers", icon: "local-florist" },
  { id: "chocolates", label: "Treats", icon: "cookie" },
  { id: "wellness", label: "Wellness", icon: "spa" },
];

const gifts = [
  {
    id: "1",
    name: "Blushing Peonies",
    desc: "Premium Stem Collection",
    price: 45,
    category: "flowers" as GiftCategory,
    icon: "local-florist",
  },
  {
    id: "2",
    name: "Classic Red Roses",
    desc: "Dozen Long Stemmed",
    price: 60,
    category: "flowers" as GiftCategory,
    icon: "filter-vintage",
  },
  {
    id: "3",
    name: "Dark Truffle Box",
    desc: "12pc Handcrafted Selection",
    price: 38,
    category: "chocolates" as GiftCategory,
    icon: "cookie",
  },
  {
    id: "4",
    name: "Pastel Garden Mix",
    desc: "Seasonal Wildflowers",
    price: 52,
    category: "flowers" as GiftCategory,
    icon: "yard",
  },
  {
    id: "5",
    name: "Truffle Assortment",
    desc: "Premium Belgian Chocolates",
    price: 42,
    category: "chocolates" as GiftCategory,
    icon: "cake",
  },
  {
    id: "6",
    name: "Spa Gift Set",
    desc: "Relax & Unwind Bundle",
    price: 55,
    category: "wellness" as GiftCategory,
    icon: "spa",
  },
];

export default function GiftSelectionScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GiftCategory>("flowers");
  const filtered = gifts.filter((g) => g.category === activeTab);

  return (
    <View className="flex-1 bg-background-light pt-12">
      <Header
        title="Gift Store"
        showBack
        rightAction={
          <TouchableOpacity className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center">
            <MaterialIcons name="shopping-bag" size={20} color={Colors.rose[500]} />
          </TouchableOpacity>
        }
      />

      <ScrollView className="px-5" showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        <Text className="text-2xl font-extrabold text-slate-800 mt-4 tracking-tight">
          Show you care
        </Text>
        <Text className="text-sm text-slate-500 mt-1">
          Thoughtful gifts to brighten their day
        </Text>

        {/* Tabs */}
        <View className="flex-row gap-2 mt-6">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border ${
                  active ? "bg-primary border-primary" : "bg-white border-slate-100"
                }`}
                onPress={() => setActiveTab(t.id)}
                style={active ? {
                  shadowColor: Colors.primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                } : undefined}
              >
                <MaterialIcons 
                  name={t.icon as any} 
                  size={18} 
                  color={active ? Colors.rose[900] : Colors.slate[400]} 
                />
                <Text className={`text-sm font-bold ${active ? "text-rose-900" : "text-slate-500"}`}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Grid */}
        <View className="flex-row flex-wrap gap-3 mt-6">
          {filtered.map((g) => (
            <View
              key={g.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 w-[48%]"
              style={{
                shadowColor: Colors.black,
                shadowOpacity: 0.05,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <View className="w-full h-32 bg-rose-50/50 items-center justify-center">
                <MaterialIcons name={g.icon as any} size={44} color={Colors.rose[400]} />
              </View>
              <View className="p-3">
                <Text className="text-sm font-bold text-slate-800">{g.name}</Text>
                <Text className="text-xs text-slate-400 mt-0.5">{g.desc}</Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-base font-extrabold text-rose-500">
                    ${g.price}
                  </Text>
                  <TouchableOpacity
                    className="bg-slate-900 rounded-lg px-3 py-1.5"
                    onPress={() => router.push("/partner/gift-reveal")}
                  >
                    <Text className="text-xs font-bold text-white">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Personalized Suggestion */}
        <TouchableOpacity 
          className="bg-white rounded-2xl flex-row items-center p-4 mt-6 border border-slate-100"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mr-3">
            <MaterialIcons name="auto-awesome" size={22} color={Colors.indigo[500]} />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-slate-400 font-medium">AI Suggestion</Text>
            <Text className="text-base font-bold text-slate-800">The "Comfort" Bundle</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.slate[300]} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
