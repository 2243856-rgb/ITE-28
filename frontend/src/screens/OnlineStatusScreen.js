import React from "react";

import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    StyleSheet,
} from "react-native";

import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";

const SYSTEM_SERVICES = [
    { id: "1", label: "API SERVER",       status: "ONLINE",  uptime: "99.9%" },
    { id: "2", label: "DATABASE",         status: "ONLINE",  uptime: "99.7%" },
    { id: "3", label: "APPOINTMENT SVC",  status: "ONLINE",  uptime: "98.5%" },
    { id: "4", label: "PET RECORDS SVC",  status: "ONLINE",  uptime: "99.1%" },
    { id: "5", label: "CHATBOT SVC",      status: "ONLINE",  uptime: "97.3%" },
    { id: "6", label: "NOTIFICATION SVC", status: "OFFLINE", uptime: "0.0%"  },
];

function ServiceRow({ label, status, uptime }) {
    const isOnline = status === "ONLINE";

    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={[styles.dot, isOnline ? styles.dotOnline : styles.dotOffline]} />
                <Text style={styles.serviceLabel}>{label}</Text>
            </View>

            <View style={styles.rowRight}>
                <Text style={[styles.uptimeText, { color: isOnline ? colors.darkRed : colors.border }]}>
                    {uptime}
                </Text>

                <View style={[styles.statusBadge, isOnline ? styles.badgeOnline : styles.badgeOffline]}>
                    <Text style={[styles.statusText, isOnline ? styles.textOnline : styles.textOffline]}>
                        {status}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default function OnlineStatusScreen() {
    const onlineCount = SYSTEM_SERVICES.filter(s => s.status === "ONLINE").length;
    const allOnline   = onlineCount === SYSTEM_SERVICES.length;

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View style={globalStyles.container}>
                    <View style={globalStyles.headerContainer}>
                        <Text style={globalStyles.title}>SYSTEM STATUS</Text>
                        <Text style={globalStyles.subtitle}>
                            {onlineCount}/{SYSTEM_SERVICES.length} SERVICES ONLINE
                        </Text>
                    </View>

                    {/* Overall status banner */}
                    <View style={[styles.banner, allOnline ? styles.bannerGreen : styles.bannerRed]}>
                        <Text
                            style={[
                                styles.bannerText,
                                allOnline
                                    ? styles.bannerTextOnLight
                                    : styles.bannerTextOnRed,
                            ]}
                        >
                            {allOnline ? "✓  ALL SYSTEMS OPERATIONAL" : "⚠  SOME SERVICES OFFLINE"}
                        </Text>
                    </View>

                    <View style={[globalStyles.section, { marginTop: 12 }]}>
                        <Text style={styles.sectionTitle}>SERVICE MONITOR</Text>

                        {SYSTEM_SERVICES.map((svc) => (
                            <ServiceRow
                                key={svc.id}
                                label={svc.label}
                                status={svc.status}
                                uptime={svc.uptime}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    banner: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        paddingVertical: 16,
        paddingHorizontal: 18,
        alignItems: "center",
    },

    bannerGreen: {
        backgroundColor: colors.surfaceGoldTint,
        borderLeftWidth: 4,
        borderLeftColor: colors.gold,
    },

    bannerRed: {
        backgroundColor: colors.red,
        borderLeftWidth: 4,
        borderLeftColor: colors.darkRed,
    },

    bannerText: {
        fontWeight: "800",
        fontSize: 14,
        letterSpacing: 1,
    },

    bannerTextOnLight: {
        color: colors.ink,
    },

    bannerTextOnRed: {
        color: colors.white,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 14,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: colors.border,
    },

    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.borderStrong,
    },

    dotOnline: {
        backgroundColor: colors.gold,
    },

    dotOffline: {
        backgroundColor: colors.border,
    },

    serviceLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: colors.textPrimary,
        letterSpacing: 0.6,
    },

    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    uptimeText: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.5,
        marginRight: 6,
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 2,
    },

    badgeOnline: {
        backgroundColor: colors.surfaceGoldTint,
        borderColor: colors.gold,
    },

    badgeOffline: {
        backgroundColor: colors.background,
        borderColor: colors.border,
    },

    statusText: {
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 0.5,
    },

    textOnline: {
        color: colors.darkRed,
    },

    textOffline: {
        color: colors.darkRed,
    },
});
