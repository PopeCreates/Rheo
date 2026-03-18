import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  type: "text" | "suggestion";
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hi there! I'm your Bunny Assistant. How can I help you today with your cycle tracking?",
    isUser: false,
    timestamp: "10:00 AM",
    type: "text",
  },
];

const quickSuggestions = [
  "When is my next period?",
  "Why am I feeling tired?",
  "Tips for cramps",
  "What phase am I in?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate bunny response
    setTimeout(() => {
      const bunnyResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBunnyResponse(inputText),
        isUser: false,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        type: "text",
      };
      setMessages((prev) => [...prev, bunnyResponse]);
    }, 1000);
  };

  const getBunnyResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("period") || lower.includes("next")) {
      return "Based on your cycle data, your next period is expected in about 12 days. I'll remind you when it's getting close!";
    }
    if (lower.includes("tired") || lower.includes("energy")) {
      return "Feeling tired is common during certain phases of your cycle. During the luteal phase, your body uses more energy. Try getting extra rest and staying hydrated!";
    }
    if (lower.includes("cramp")) {
      return "For cramps, try gentle stretching, a warm compress on your lower abdomen, or some light yoga. Staying hydrated and avoiding caffeine can also help!";
    }
    if (lower.includes("phase")) {
      return "You're currently in Day 2 of your Menstrual Phase. This is a great time to rest and practice self-care. Your energy will pick up in a few days!";
    }
    return "I understand! Remember, every body is unique. If you have specific concerns, I'm here to help track patterns and provide insights based on your cycle.";
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pt-14 pb-4 bg-white/90 border-b border-rose-100"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <View className="w-11 h-11 rounded-full bg-primary items-center justify-center border-2 border-white">
              <MaterialIcons name="pets" size={24} color={Colors.rose[500]} />
            </View>
            <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </View>
          <View>
            <Text className="text-lg font-extrabold text-slate-800">
              Bunny Assistant
            </Text>
            <Text className="text-xs font-semibold text-rose-500">Online</Text>
          </View>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center">
          <MaterialIcons name="more-vert" size={22} color={Colors.rose[500]} />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Date Badge */}
        <View className="items-center mb-6">
          <View className="bg-rose-100/50 px-4 py-1.5 rounded-full">
            <Text className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">
              Today
            </Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}
          >
            <View className="flex-row items-end gap-2">
              {!message.isUser && (
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mb-1">
                  <MaterialIcons name="pets" size={16} color={Colors.rose[500]} />
                </View>
              )}
              <View
                className={`max-w-[80%] px-4 py-3 ${
                  message.isUser
                    ? "bg-slate-900 rounded-2xl rounded-br-none"
                    : "bg-white rounded-2xl rounded-bl-none border border-rose-100"
                }`}
                style={
                  !message.isUser
                    ? {
                        shadowColor: Colors.rose[200],
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                      }
                    : undefined
                }
              >
                <Text
                  className={`text-[15px] leading-relaxed ${
                    message.isUser ? "text-white" : "text-slate-700"
                  }`}
                >
                  {message.text}
                </Text>
              </View>
            </View>
            <Text
              className={`text-[10px] text-slate-400 font-medium mt-1 ${
                message.isUser ? "mr-1" : "ml-10"
              }`}
            >
              {message.timestamp}
            </Text>
          </View>
        ))}

        {/* Quick Suggestions */}
        {messages.length <= 2 && (
          <View className="mt-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Questions
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white border border-rose-100 px-4 py-2.5 rounded-full"
                  onPress={() => handleSuggestion(suggestion)}
                  style={{
                    shadowColor: Colors.rose[200],
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                >
                  <Text className="text-sm font-semibold text-slate-600">
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View className="px-4 py-4 pb-8 bg-white border-t border-rose-100">
        <View className="flex-row items-center gap-2 bg-rose-50/50 rounded-2xl px-3 py-2 border border-rose-100">
          <TouchableOpacity className="p-1">
            <MaterialIcons
              name="add-circle"
              size={26}
              color={Colors.rose[400]}
            />
          </TouchableOpacity>

          <TextInput
            className="flex-1 text-[15px] text-slate-800 py-2"
            placeholder="Ask me anything..."
            placeholderTextColor={Colors.rose[300]}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          <TouchableOpacity className="p-1">
            <MaterialIcons
              name="sentiment-satisfied"
              size={24}
              color={Colors.rose[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: Colors.primaryAccent }}
            onPress={handleSend}
          >
            <MaterialIcons
              name={inputText.trim() ? "send" : "mic"}
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
