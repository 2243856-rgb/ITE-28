import React from "react";

import { createBottomTabNavigator }
    from "@react-navigation/bottom-tabs";

import Ionicons
    from "@expo/vector-icons/Ionicons";

import HomeScreen
    from "../screens/HomeScreen";

import ChatbotScreen
    from "../screens/ChatbotScreen";

import PetProfileScreen
    from "../screens/PetProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: colors.red,

                    borderTopWidth: 3,
                    borderTopColor: colors.black,

                    height: 72,

                    paddingBottom: 6,
                    paddingTop: 6,
                },

                tabBarActiveTintColor: colors.gold,

                tabBarInactiveTintColor:
                colors.white,

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "900",
                    letterSpacing: 1,
                },
            }}
        >
            <Tab.Screen
                name="HOME"
                component={HomeScreen}

                options={{
                    tabBarIcon: ({
                                     color,
                                     size,
                                 }) => (
                        <Ionicons
                            name="home"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="CHATBOT"
                component={ChatbotScreen}

                options={{
                    tabBarIcon: ({
                                     color,
                                     size,
                                 }) => (
                        <Ionicons
                            name="chatbox"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="PETS"
                component={PetProfileScreen}

                options={{
                    tabBarIcon: ({
                                     color,
                                     size,
                                 }) => (
                        <Ionicons
                            name="paw"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
