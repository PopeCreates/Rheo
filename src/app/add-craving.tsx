import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

const categories = ["Food", "Comfort", "Activity"];
const quick = ["Ice Cream", "Hugs", "Movie Night", "Chocolate"];

export default function AddCravingScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [cat, setCat] = useState("Food");

  return (
    <View className="flex-1 bg-surface pt-12">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#181114" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-content">Add Custom Craving</Text>
        <TouchableOpacity>
          <MaterialIcons name="check" size={24} color="#f90680" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-content mt-6 tracking-tight">{"What's on your mind?"}</Text>
        <Text className="text-sm text-content-secondary mt-2 leading-5">
          Let us know what would make you feel better today.
        </Text>

        <Text className="text-sm font-bold text-content mt-6 mb-2">{"I'm really craving..."}</Text>
        <TextInput
          className="bg-surface-soft rounded-2xl border border-line p-4 h-28 text-base text-content"
          placeholder="Double fudge brownies, a weighted blanket, or maybe just a nap..."
          placeholderTextColor="rgba(249,6,128,0.4)"
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        <Text className="text-base font-bold text-content mt-6 mb-3">Category</Text>
        <View className="flex-row bg-white rounded-full border border-line overflow-hidden">
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              className={`flex-1 items-center py-3 ${cat === c ? "bg-brand-light rounded-full" : ""}`}
              onPress={() => setCat(c)}
            >
              <Text className={`text-sm font-semibold ${cat === c ? "text-brand font-bold" : "text-content-secondary"}`}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-base font-bold text-content mt-6 mb-3">{"Show us what you're dreaming of"}</Text>
        <TouchableOpacity className="border-2 border-dashed border-brand rounded-2xl py-10 items-center justify-center gap-2 bg-surface-soft">
          <MaterialIcons name="add-a-photo" size={36} color="#f90680" />
          <Text className="text-base font-bold text-brand">Snap a pic or upload</Text>
          <Text className="text-xs text-content-secondary">Help your partner get it right!</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 py-5">
          {quick.map((q) => (
            <TouchableOpacity key={q} className="bg-white rounded-full px-4 py-2 border border-line" onPress={() => setText(q)}>
              <Text className="text-xs font-medium text-content">{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="h-10" />
      </ScrollView>

      <View className="px-6 pb-10">
        <Button
          title="Share with Partners"
          onPress={() => router.back()}
          icon={<MaterialIcons name="favorite" size={20} color="#fff" />}
        />
      </View>
    </View>
  );
}
