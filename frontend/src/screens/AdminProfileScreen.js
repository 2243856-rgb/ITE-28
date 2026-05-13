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

export default function AdminProfileScreen() {
    const { user, logout } = useAuth();

    const onSignOut = () => {
        Alert.alert("Sign out", "Sign out of the admin console?", [
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
                <Text style={globalStyles.title}>Admin</Text>
                <Text style={globalStyles.subtitle}>
                    Clinic console · sign out when you are done
                </Text>

                <View style={styles.card}>
                    <Row label="Name" value={user?.fullName || "—"} />
                    <Row label="Email" value={user?.email || "—"} />
                    <Row label="Role" value={user?.role || "ADMIN"} />
                </View>

                <TouchableOpacity style={styles.signOut} onPress={onSignOut}>
                    <Text style={styles.signOutText}>Sign out</Text>
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
    signOut: {
        marginTop: 28,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.darkRed,
        alignItems: "center",
    },
    signOutText: {
        fontWeight: "800",
        color: colors.darkRed,
        fontSize: 15,
    },
});
