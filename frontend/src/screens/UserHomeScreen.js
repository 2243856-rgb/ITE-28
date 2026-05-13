import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";
import { useAuth } from "../context/AuthContext";
import { fetchPets } from "../services/pets.api";
import { fetchAppointments } from "../services/appointments.api";

export default function UserHomeScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [petCount, setPetCount] = useState(0);
    const [apptCount, setApptCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        const [p, a] = await Promise.all([fetchPets(), fetchAppointments()]);
        if (p.ok) setPetCount(p.items.length);
        if (a.ok) setApptCount(a.items.length);
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={globalStyles.container}>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.name}>{user?.fullName || "Pet parent"}</Text>
                    <Text style={styles.sub}>
                        Manage your pets and visits in one place.
                    </Text>

                    <View style={styles.row}>
                        <View style={styles.stat}>
                            <Text style={styles.statNum}>{petCount}</Text>
                            <Text style={styles.statLabel}>Pets</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNum}>{apptCount}</Text>
                            <Text style={styles.statLabel}>Appointments</Text>
                        </View>
                    </View>

                    <Text style={styles.section}>Quick actions</Text>

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        activeOpacity={0.88}
                        onPress={() => navigation.navigate("BookAppointment")}
                    >
                        <Text style={styles.primaryBtnText}>Book appointment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        activeOpacity={0.88}
                        onPress={() =>
                            navigation.navigate("Main", { screen: "PETS" })
                        }
                    >
                        <Text style={styles.secondaryBtnText}>My pets</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        activeOpacity={0.88}
                        onPress={() =>
                            navigation.navigate("Main", {
                                screen: "APPOINTMENTS",
                            })
                        }
                    >
                        <Text style={styles.secondaryBtnText}>My appointments</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingBottom: 32 },
    greeting: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    name: {
        fontSize: 28,
        fontWeight: "900",
        color: colors.textPrimary,
        marginTop: 4,
    },
    sub: {
        marginTop: 10,
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 22,
    },
    stat: {
        width: "48%",
        backgroundColor: colors.surfaceElevated,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomWidth: 3,
        borderBottomColor: colors.primary,
    },
    statNum: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.primary,
    },
    statLabel: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    section: {
        marginTop: 28,
        marginBottom: 10,
        fontSize: 13,
        fontWeight: "800",
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: colors.darkRed,
    },
    primaryBtnText: {
        color: colors.white,
        fontWeight: "800",
        fontSize: 15,
        letterSpacing: 0.5,
    },
    secondaryBtn: {
        backgroundColor: colors.surfaceElevated,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    secondaryBtnText: {
        color: colors.darkRed,
        fontWeight: "800",
        fontSize: 14,
    },
});
