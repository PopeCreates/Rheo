import React, { useState } from "react";
import { View, Platform, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/colors";

export default function TabLayout() {
  const router = useRouter();
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  const handleFabPress = () => {
    setFabMenuOpen(true);
  };

  const handleQuickLog = () => {
    setFabMenuOpen(false);
    router.push("/log-modal");
  };

  const handleAddCraving = () => {
    setFabMenuOpen(false);
    router.push("/add-craving");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "rgba(255,255,255,0.92)",
            borderTopWidth: 1,
            borderTopColor: "#fce7f3",
            height: Platform.OS === "ios" ? 88 : 70,
            paddingBottom: Platform.OS === "ios" ? 28 : 10,
            paddingTop: 10,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backdropFilter: "blur(20px)",
          },
          tabBarActiveTintColor: Colors.rose[500],
          tabBarInactiveTintColor: Colors.slate[400],
          tabBarLabelStyle: { 
            fontSize: 10, 
            fontWeight: "800", 
            marginTop: 2,
            textTransform: "uppercase",
            letterSpacing: -0.5,
          },
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons 
                name={focused ? "home" : "home"} 
                size={26} 
                color={color} 
              />
            ),
          }}
        />

        {/* Calendar Tab */}
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Plan",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons 
                name="calendar-month" 
                size={26} 
                color={color} 
              />
            ),
          }}
        />

        {/* Center FAB Placeholder - Hidden but needed for layout */}
        <Tabs.Screen
          name="log"
          options={{
            title: "",
            tabBarButton: () => (
              <View className="flex-1 items-center justify-center">
                <TouchableOpacity
                  onPress={handleFabPress}
                  activeOpacity={0.85}
                  className="w-16 h-16 rounded-full items-center justify-center -mt-8"
                  style={{
                    backgroundColor: Colors.text,
                    shadowColor: Colors.rose[500],
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 8,
                  }}
                >
                  <MaterialIcons name="add" size={32} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        {/* Chat Tab */}
        <Tabs.Screen
          name="chat"
          options={{
            title: "Talk",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons 
                name="forum" 
                size={26} 
                color={color} 
              />
            ),
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Me",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons 
                name="person" 
                size={26} 
                color={color} 
              />
            ),
          }}
        />

        {/* Hidden screens - accessed from other places */}
        <Tabs.Screen
          name="insights"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>

      {/* FAB Menu Modal */}
      <Modal
        visible={fabMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFabMenuOpen(false)}
      >
        <Pressable 
          className="flex-1 justify-end items-center pb-32"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setFabMenuOpen(false)}
        >
          <View className="bg-white rounded-3xl p-4 w-64 gap-2">
            <TouchableOpacity 
              className="flex-row items-center gap-4 p-4 rounded-2xl bg-rose-50"
              onPress={handleQuickLog}
            >
              <View className="w-12 h-12 rounded-2xl bg-primary items-center justify-center">
                <MaterialIcons name="edit-note" size={24} color={Colors.rose[900]} />
              </View>
              <View>
                <Text className="text-base font-bold text-slate-800">Log Symptoms</Text>
                <Text className="text-xs text-slate-500">Track mood & flow</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center gap-4 p-4 rounded-2xl bg-indigo-50"
              onPress={handleAddCraving}
            >
              <View className="w-12 h-12 rounded-2xl bg-indigo-100 items-center justify-center">
                <MaterialIcons name="fastfood" size={24} color={Colors.indigo[500]} />
              </View>
              <View>
                <Text className="text-base font-bold text-slate-800">Add Craving</Text>
                <Text className="text-xs text-slate-500">Save for partner</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
