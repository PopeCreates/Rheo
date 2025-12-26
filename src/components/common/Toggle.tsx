import { View, TouchableOpacity } from "react-native"
import type { ToggleProps } from "../../interfaces/interface"

export function Toggle({ value, onValueChange }: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      className={`w-14 h-8 rounded-full p-0.5 ${value ? "bg-primary" : "bg-dark-border"}`}
    >
      <View className={`w-7 h-7 rounded-full bg-white ${value ? "self-end" : "self-start"}`} />
    </TouchableOpacity>
  )
}
