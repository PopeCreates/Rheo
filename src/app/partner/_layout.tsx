import { Stack } from "expo-router";

export default function PartnerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#fdf8fa" },
        animation: "slide_from_right",
      }}
    />
  );
}
