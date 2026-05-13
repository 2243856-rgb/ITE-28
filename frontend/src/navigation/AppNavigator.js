import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "./BottomTabNavigator";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import colors from "../theme/colors/theme";

const Stack = createNativeStackNavigator();

/** Logged-in owner: tabs + book appointment modal stack */
export default function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.chrome,
                    borderBottomWidth: 2,
                    borderBottomColor: colors.primary,
                },
                headerTintColor: colors.primary,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
                headerTitleStyle: {
                    fontWeight: "800",
                    letterSpacing: 1.1,
                    color: colors.white,
                },
            }}
        >
            <Stack.Screen
                name="Main"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BookAppointment"
                component={BookAppointmentScreen}
                options={{ title: "Book appointment" }}
            />
        </Stack.Navigator>
    );
}
