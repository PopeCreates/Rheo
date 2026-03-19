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
import { Colors } from "@/constants/colors";

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
    <View className="flex-1 bg-background-light">
      {/* Close button */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-2">
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-white border border-slate-100 items-center justify-center"
          onPress={() => router.back()}
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <MaterialIcons name="close" size={22} color={Colors.slate[800]} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800">
          A Surprise for You!
        </Text>
        <View className="w-11" />
      </View>

      <ScrollView
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Gift Image Area */}
        <View className="items-center mt-6">
          <View 
            className="w-full h-64 bg-rose-50 rounded-3xl items-center justify-center overflow-hidden"
            style={{
              shadowColor: Colors.rose[200],
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <MaterialIcons name="local-florist" size={80} color={Colors.rose[400]} />
          </View>
        </View>

        {/* Gift Info Card */}
        <View 
          className="bg-white rounded-3xl p-6 mt-6 border border-slate-100"
          style={{
            shadowColor: Colors.black,
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text className="text-xs font-bold text-rose-500 tracking-widest mb-2">
            NEW GIFT RECEIVED
          </Text>
          <Text className="text-2xl font-extrabold text-slate-800 leading-8">
            Flowers are coming your way!
          </Text>

          {/* Quote */}
          <View className="bg-rose-50 rounded-2xl p-5 mt-4 border-l-4 border-primary">
            <Text className="text-base text-slate-700 italic leading-6">
              "Thought you{"'"}d like these to brighten your day. Love you
              always!"
            </Text>
          </View>

          {/* From */}
          <View className="flex-row items-center gap-3 mt-4">
            <View className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center">
              <MaterialIcons name="person" size={20} color={Colors.rose[400]} />
            </View>
            <Text className="text-sm text-slate-500 font-medium">
              From your partner
            </Text>
          </View>
        </View>

        {/* Delivery Info */}
        <Text className="text-sm text-slate-400 text-center mt-6 leading-5">
          Your delivery is scheduled for today between{"\n"}2:00 PM and 5:00 PM.
        </Text>

        {/* Thank You Section */}
        {!thanksSent ? (
          <View className="mt-8">
            <Button
              title="Say Thank You"
              onPress={() => setThanksSent(true)}
              icon={
                <MaterialIcons name="chat-bubble" size={20} color={Colors.rose[900]} />
              }
            />
            <TouchableOpacity className="items-center mt-4">
              <Text className="text-sm font-medium text-slate-400">
                Not now, remind me later
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View 
            className="bg-white rounded-3xl p-6 mt-8 border border-slate-100"
            style={{
              shadowColor: Colors.black,
              shadowOpacity: 0.05,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text className="text-xs font-bold text-rose-500 text-center mb-4 tracking-widest">
              SAY THANKS!
            </Text>

            {/* Quick responses */}
            <View className="flex-row flex-wrap gap-2 justify-center">
              {quickResponses.map((r) => (
                <TouchableOpacity
                  key={r.label}
                  className="flex-row items-center gap-2 bg-rose-50 rounded-full px-4 py-2.5"
                >
                  <MaterialIcons
                    name={r.icon as any}
                    size={16}
                    color={Colors.rose[500]}
                  />
                  <Text className="text-sm font-bold text-rose-500">
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom note */}
            <View className="flex-row items-center gap-3 mt-5 pt-5 border-t border-slate-100">
              <TextInput
                className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-800"
                placeholder="Write a sweet note..."
                placeholderTextColor={Colors.slate[400]}
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity className="w-11 h-11 rounded-xl bg-slate-900 items-center justify-center">
                <MaterialIcons name="send" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
