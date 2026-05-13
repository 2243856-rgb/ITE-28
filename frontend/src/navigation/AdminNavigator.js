import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminTabNavigator from "./AdminTabNavigator";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import PetsScreen from "../screens/PetsScreen";
import StaffScreen from "../screens/StaffScreen";
import BookingsScreen from "../screens/BookingsScreen";
import OnlineStatusScreen from "../screens/OnlineStatusScreen";
import colors from "../theme/colors/theme";

const Stack = createNativeStackNavigator();

/** Logged-in ADMIN: dashboard tabs + stack screens opened from dashboard tiles */
export default function AdminNavigator() {
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
                name="AdminMain"
                component={AdminTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BookAppointment"
                component={BookAppointmentScreen}
                options={{ title: "Book appointment" }}
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
    );
}
