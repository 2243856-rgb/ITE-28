import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";

import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";
import { useAuth } from "../context/AuthContext";

export default function UserProfileScreen() {
    const { user, logout } = useAuth();

    const onLogout = () => {
        Alert.alert("Sign out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign out",
                style: "destructive",
                onPress: () => logout(),
            },
        ]);
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Profile</Text>
                <Text style={globalStyles.subtitle}>Your NestVet account</Text>

                <View style={styles.card}>
                    <Row label="Name" value={user?.fullName || "—"} />
                    <Row label="Email" value={user?.email || "—"} />
                    <Row label="Role" value={user?.role || "OWNER"} />
                    {user?.phoneNumber ? (
                        <Row label="Phone" value={user.phoneNumber} />
                    ) : null}
                </View>

                <TouchableOpacity style={styles.logout} onPress={onLogout}>
                    <Text style={styles.logoutText}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Row({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        backgroundColor: colors.surfaceElevated,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
    },
    row: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    label: {
        fontSize: 12,
        fontWeight: "800",
        color: colors.textMuted,
        letterSpacing: 0.8,
    },
    value: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    logout: {
        marginTop: 28,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.darkRed,
        alignItems: "center",
    },
    logoutText: {
        fontWeight: "800",
        color: colors.darkRed,
        fontSize: 15,
    },
});
