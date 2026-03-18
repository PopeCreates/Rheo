import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import type { ButtonProps } from "@/types/interface";
import { Colors } from "@/constants/colors";

const variantClasses: Record<string, string> = {
  primary: "bg-primary shadow-lg",
  secondary: "bg-rose-50",
  ghost: "bg-transparent",
  outline: "bg-transparent border-2 border-primary",
  dark: "bg-slate-900",
};

const variantText: Record<string, string> = {
  primary: "text-rose-900 text-lg",
  secondary: "text-rose-500 text-base",
  ghost: "text-slate-500 text-base",
  outline: "text-rose-500 text-base",
  dark: "text-white text-lg",
};

const sizeClasses: Record<string, string> = {
  sm: "h-10 px-5",
  md: "h-12 px-6",
  lg: "h-14 px-8",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  loading = false,
  icon,
  className = "",
  textClassName = "",
}: ButtonProps) {
  const loaderColor = variant === "primary" ? Colors.rose[900] : 
                      variant === "dark" ? Colors.white : Colors.primaryAccent;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center gap-2 rounded-xl w-full
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${disabled ? "opacity-50" : ""} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={variant === "primary" ? { shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } } : undefined}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <>
          {icon}
          <Text className={`font-bold ${variantText[variant]} ${textClassName}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
