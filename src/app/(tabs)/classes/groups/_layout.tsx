import { Stack } from "expo-router";

export default function GroupsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#101c22",
                },
                headerTintColor: "#fff",        
                headerShadowVisible: false,
                headerShown: false,
            }}
        > 
            <Stack.Screen 
                name="[id]"
                options={{
                    title: "Group Details",
                    headerShown: false,
                }}
            />
        </Stack>
    )
}