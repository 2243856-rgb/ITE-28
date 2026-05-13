import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import AdminProfileScreen from "../screens/AdminProfileScreen";
import colors from "../theme/colors/theme";

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.chrome,
                    borderTopWidth: 2,
                    borderTopColor: colors.primary,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "800",
                    letterSpacing: 0.8,
                },
            }}
        >
            <Tab.Screen
                name="DASHBOARD"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ADMIN_ACCOUNT"
                component={AdminProfileScreen}
                options={{
                    tabBarLabel: "Account",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
