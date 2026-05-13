import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";
import {
    fetchAppointments,
    cancelAppointmentRequest,
} from "../services/appointments.api";

function formatWhen(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleString();
    } catch {
        return iso;
    }
}

export default function UserAppointmentsScreen() {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        const res = await fetchAppointments();
        if (res.ok) setItems(res.items);
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

    const confirmCancel = (id) => {
        Alert.alert(
            "Cancel appointment",
            "Cancel this visit? You can book a new one anytime.",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, cancel",
                    style: "destructive",
                    onPress: async () => {
                        const res = await cancelAppointmentRequest(id);
                        if (!res.ok) {
                            Alert.alert("Error", res.message);
                            return;
                        }
                        await load();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />
            <View style={styles.top}>
                <Text style={globalStyles.title}>Appointments</Text>
                <Text style={globalStyles.subtitle}>
                    Upcoming and past visits for your pets.
                </Text>
                <TouchableOpacity
                    style={styles.bookBtn}
                    activeOpacity={0.88}
                    onPress={() => navigation.navigate("BookAppointment")}
                >
                    <Text style={styles.bookBtnText}>+ Book new</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.appointmentId}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        No appointments yet. Book your first visit from the button
                        above.
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardTop}>
                            <Text style={styles.type}>{item.appointmentType}</Text>
                            <Text
                                style={[
                                    styles.status,
                                    item.status === "CANCELLED" && styles.stOff,
                                ]}
                            >
                                {item.status}
                            </Text>
                        </View>
                        <Text style={styles.when}>
                            {formatWhen(item.scheduledStart)} →{" "}
                            {formatWhen(item.scheduledEnd)}
                        </Text>
                        {item.reason ? (
                            <Text style={styles.reason}>{item.reason}</Text>
                        ) : null}
                        {item.isActive && item.status !== "CANCELLED" ? (
                            <TouchableOpacity
                                onPress={() => confirmCancel(item.appointmentId)}
                                style={styles.cancelLink}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    top: {
        paddingHorizontal: 22,
        paddingTop: 8,
        marginBottom: 8,
    },
    bookBtn: {
        marginTop: 14,
        alignSelf: "flex-start",
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderBottomWidth: 3,
        borderBottomColor: colors.darkRed,
    },
    bookBtnText: {
        color: colors.white,
        fontWeight: "800",
        fontSize: 13,
    },
    empty: {
        textAlign: "center",
        marginTop: 36,
        color: colors.textMuted,
        fontSize: 15,
        paddingHorizontal: 12,
    },
    card: {
        backgroundColor: colors.surfaceElevated,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    type: {
        fontWeight: "800",
        color: colors.textPrimary,
        fontSize: 15,
    },
    status: {
        fontWeight: "800",
        color: colors.primary,
        fontSize: 12,
    },
    stOff: {
        color: colors.textMuted,
    },
    when: {
        marginTop: 8,
        fontSize: 13,
        color: colors.textSecondary,
    },
    reason: {
        marginTop: 6,
        fontSize: 13,
        color: colors.textPrimary,
    },
    cancelLink: {
        marginTop: 12,
    },
    cancelText: {
        color: colors.darkRed,
        fontWeight: "800",
        fontSize: 13,
    },
});
