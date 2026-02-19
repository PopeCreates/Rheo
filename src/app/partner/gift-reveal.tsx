import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

const quickResponses = [
  { label: "Love you!", icon: "favorite" },
  { label: "You're the best!", icon: "emoji-events" },
  { label: "This made my day!", icon: "sentiment-very-satisfied" },
];

export default function GiftRevealScreen() {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [thanksSent, setThanksSent] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      {/* Close button */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-2">
        <TouchableOpacity
          className="w-11 h-11 items-center justify-center"
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={24} color="#181114" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-content">
          A Surprise for You!
        </Text>
        <View className="w-11" />
      </View>

      <ScrollView
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Gift Image Area */}
        <View className="items-center mt-6">
          <View className="w-full h-72 bg-surface-soft rounded-3xl items-center justify-center overflow-hidden">
            <MaterialIcons name="local-florist" size={80} color="#f90680" />
          </View>
        </View>

        {/* Gift Info Card */}
        <View className="bg-white rounded-3xl p-6 mt-6 border border-line">
          <Text className="text-xs font-bold text-brand tracking-[3px] mb-2">
            NEW GIFT RECEIVED
          </Text>
          <Text className="text-2xl font-extrabold text-content leading-8">
            Flowers are coming your way!
          </Text>

          {/* Quote */}
          <View className="bg-brand-light/50 rounded-2xl p-5 mt-4 border-l-4 border-brand">
            <Text className="text-base text-content italic leading-6">
              "Thought you{"'"}d like these to brighten your day. Love you
              always!"
            </Text>
          </View>

          {/* From */}
          <View className="flex-row items-center gap-3 mt-4">
            <View className="w-10 h-10 rounded-full bg-surface-soft items-center justify-center">
              <MaterialIcons name="person" size={20} color="#8c5f75" />
            </View>
            <Text className="text-sm text-content-secondary font-medium">
              From your partner
            </Text>
          </View>
        </View>

        {/* Delivery Info */}
        <Text className="text-sm text-content-secondary text-center mt-6 leading-5">
          Your delivery is scheduled for today between{"\n"}2:00 PM and 5:00 PM.
        </Text>

        {/* Thank You Section */}
        {!thanksSent ? (
          <View className="mt-8">
            <Button
              title="Say Thank You"
              onPress={() => setThanksSent(true)}
              icon={
                <MaterialIcons name="chat-bubble" size={22} color="#fff" />
              }
            />
            <TouchableOpacity className="items-center mt-4">
              <Text className="text-sm font-medium text-brand">
                Not now, remind me later
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-3xl p-6 mt-8 border border-line">
            <Text className="text-lg font-bold text-brand text-center mb-4 tracking-wide">
              SAY THANKS!
            </Text>

            {/* Quick responses */}
            <View className="flex-row flex-wrap gap-3 justify-center">
              {quickResponses.map((r) => (
                <TouchableOpacity
                  key={r.label}
                  className="flex-row items-center gap-2 bg-brand-light rounded-full px-5 py-3"
                >
                  <MaterialIcons
                    name={r.icon as any}
                    size={18}
                    color="#f90680"
                  />
                  <Text className="text-sm font-bold text-brand">
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom note */}
            <View className="flex-row items-center gap-3 mt-5 pt-5 border-t border-line">
              <TextInput
                className="flex-1 bg-surface-soft rounded-full px-4 py-3 text-sm text-content"
                placeholder="Write a sweet note..."
                placeholderTextColor="#8c5f75"
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity className="w-12 h-12 rounded-full bg-brand items-center justify-center">
                <MaterialIcons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
