import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import colors from "../theme/colors/theme";

export default function RootNavigator() {
    const { booting, isAuthenticated } = useAuth();

    if (booting) {
        return (
            <View style={styles.splash}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
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
