import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { AppProvider } from "@/contexts/AppContext"
import { AuthProvider } from "@/contexts/AuthContext"
import "../global.css"

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="light" backgroundColor="#101c22" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#101c22",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "600",
            },
            contentStyle: {
              backgroundColor: "#101c22",
            },
            headerShown: false, // Set to false globally to prevent duplicate headers on subpages
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppProvider>
    </AuthProvider>
  )
}
