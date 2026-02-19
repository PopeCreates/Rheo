import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import type { ButtonProps } from "@/types/interface";

const variantClasses: Record<string, string> = {
  primary: "bg-brand shadow-lg shadow-brand/30",
  secondary: "bg-brand-light",
  ghost: "bg-transparent",
  outline: "bg-transparent border-2 border-brand",
};

const variantText: Record<string, string> = {
  primary: "text-content-inverse text-lg",
  secondary: "text-brand text-base",
  ghost: "text-content-secondary text-base",
  outline: "text-brand text-base",
};

const sizeClasses: Record<string, string> = {
  sm: "h-10 px-4",
  md: "h-12 px-5",
  lg: "h-14 px-6",
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
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center gap-2 rounded-full w-full
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${disabled ? "opacity-50" : ""} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#f90680"} />
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
