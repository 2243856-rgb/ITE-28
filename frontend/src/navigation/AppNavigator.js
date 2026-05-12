// src/navigation/AppNavigator.js

import React from "react";

import {
    NavigationContainer,
} from "@react-navigation/native";

import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import LoginScreen
    from "../screens/LoginScreen";

import RegisterScreen
    from "../screens/RegisterScreen";

import BottomTabNavigator
    from "./BottomTabNavigator";

import BookAppointmentScreen
    from "../screens/BookAppointmentScreen";

import PetsScreen
    from "../screens/PetProfileScreen";

import colors
    from "../theme/colors/theme";

const Stack =
    createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"

                screenOptions={{
                    headerStyle: {
                        backgroundColor:
                        colors.red,
                    },

                    headerTintColor:
                    colors.white,

                    headerShadowVisible:
                        false,

                    contentStyle: {
                        backgroundColor:
                        colors.background,
                    },

                    headerTitleStyle: {
                        fontWeight: "900",

                        letterSpacing: 1,
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

                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                />

                <Stack.Screen
                    name="Main"
                    component={
                        BottomTabNavigator
                    }

                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="BookAppointment"
                    component={
                        BookAppointmentScreen
                    }

                    options={{
                        title:
                            "BOOK APPOINTMENT",
                    }}
                />

                <Stack.Screen
    name="AdminPets"
    component={PetsScreen} 
    options={{ title: "PETS" }}
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
