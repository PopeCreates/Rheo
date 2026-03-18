import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import type { ToggleSwitchProps } from "@/types/interface";
import { Colors } from "@/constants/colors";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ToggleSwitch({ value, onToggle }: ToggleSwitchProps) {
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(value ? Colors.primary : "#e2e8f0"),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(value ? 20 : 0) }],
  }));

  return (
    <AnimatedTouchable
      className="w-14 h-8 rounded-full p-1 justify-center"
      style={trackStyle}
      onPress={() => onToggle(!value)}
      activeOpacity={0.8}
    >
      <Animated.View
        className="w-6 h-6 rounded-full bg-white"
        style={[
          thumbStyle,
          {
            shadowColor: Colors.black,
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          },
        ]}
      />
    </AnimatedTouchable>
  );
}
