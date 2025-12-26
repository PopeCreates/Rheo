import { View } from "react-native"
import type { CardProps } from "../../interfaces/interface"

export function Card({ children, className = "" }: CardProps) {
  return <View className={`bg-dark-card rounded-2xl p-4 ${className}`}>{children}</View>
}
