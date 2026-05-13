import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import UserHomeScreen from "../screens/UserHomeScreen";

import UserPetsScreen from "../screens/UserPetsScreen";

import UserAppointmentsScreen from "../screens/UserAppointmentsScreen";

import UserProfileScreen from "../screens/UserProfileScreen";

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
                    letterSpacing: 0.8,
                },
            }}
        >
            <Tab.Screen
                name="HOME"
                component={UserHomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="PETS"
                component={UserPetsScreen}
                options={{
                    tabBarLabel: "Pets",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="paw" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="APPOINTMENTS"
                component={UserAppointmentsScreen}
                options={{
                    tabBarLabel: "Visits",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="PROFILE"
                component={UserProfileScreen}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
