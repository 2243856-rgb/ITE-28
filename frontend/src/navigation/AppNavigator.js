// src/navigation/AppNavigator.js

import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";

import RegisterScreen from "../screens/RegisterScreen";

import BottomTabNavigator from "./BottomTabNavigator";

import BookAppointmentScreen from "../screens/BookAppointmentScreen";

import PetProfileScreen from "../screens/PetProfileScreen";

import PetsScreen from "../screens/PetsScreen";

import StaffScreen from "../screens/StaffScreen";

import BookingsScreen from "../screens/BookingsScreen";

import OnlineStatusScreen from "../screens/OnlineStatusScreen";

import colors from "../theme/colors/theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.chrome,
                        borderBottomWidth: 2,
                        borderBottomColor: colors.primary,
                    },

                    headerTintColor: colors.primary,

                    headerShadowVisible: false,

                    contentStyle: {
                        backgroundColor: colors.background,
                    },

                    headerTitleStyle: {
                        fontWeight: "800",
                        letterSpacing: 1.2,
                        color: colors.white,
                    },
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen name="Register" component={RegisterScreen} />

                <Stack.Screen
                    name="Main"
                    component={BottomTabNavigator}
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="BookAppointment"
                    component={BookAppointmentScreen}
                    options={{
                        title: "BOOK APPOINTMENT",
                    }}
                />

                <Stack.Screen
                    name="AdminPets"
                    component={PetsScreen}
                    options={{ title: "PETS" }}
                />

                <Stack.Screen
                    name="Staff"
                    component={StaffScreen}
                    options={{ title: "STAFF" }}
                />

                <Stack.Screen
                    name="Bookings"
                    component={BookingsScreen}
                    options={{ title: "BOOKINGS" }}
                />

                <Stack.Screen
                    name="OnlineStatus"
                    component={OnlineStatusScreen}
                    options={{ title: "STATUS" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
