import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import AdminNavigator from "./AdminNavigator";
import colors from "../theme/colors/theme";

export default function RootNavigator() {
    const { booting, isAuthenticated, user } = useAuth();

    if (booting) {
        return (
            <View style={styles.splash}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const isAdmin = user?.role === "ADMIN";

    // Web and native: no token / no valid user → only auth stack (login/register).
    return (
        <NavigationContainer>
            {isAuthenticated ? (
                isAdmin ? <AdminNavigator /> : <AppNavigator />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
});
