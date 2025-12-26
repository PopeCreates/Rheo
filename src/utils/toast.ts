import { ToastAndroid, Platform, Alert } from "react-native"

export type ToastType = "success" | "error" | "info" | "warning"

export const showToast = (message: string, type: ToastType = "info", duration: "short" | "long" = "short") => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, duration === "short" ? ToastAndroid.SHORT : ToastAndroid.LONG)
  } else {
    // For iOS, we'll use a custom toast component or Alert as fallback
    Alert.alert(
      type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Warning" : "Info",
      message,
    )
  }
}

export const toast = {
  success: (message: string, duration?: "short" | "long") => showToast(message, "success", duration),
  error: (message: string, duration?: "short" | "long") => showToast(message, "error", duration),
  info: (message: string, duration?: "short" | "long") => showToast(message, "info", duration),
  warning: (message: string, duration?: "short" | "long") => showToast(message, "warning", duration),
}
