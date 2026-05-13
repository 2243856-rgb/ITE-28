import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import colors from "../theme/colors/theme";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.chrome,
                    borderBottomWidth: 2,
                    borderBottomColor: colors.primary,
                },
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    fontWeight: "800",
                    color: colors.white,
                },
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Create account" }}
            />
        </Stack.Navigator>
    );
}
