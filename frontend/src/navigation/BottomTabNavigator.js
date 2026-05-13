import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";

import PetProfileScreen from "../screens/PetProfileScreen";

import colors from "../theme/colors/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
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
                    letterSpacing: 1.1,
                },
            }}
        >
            <Tab.Screen
                name="HOME"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="PETS"
                component={PetProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="paw" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
