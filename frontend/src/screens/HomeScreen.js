import React from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import {
    useNavigation,
} from "@react-navigation/native";

import globalStyles
    from "../theme/globalStyles";

import colors
    from "../theme/colors/theme";

import CustomButton
    from "../components/CustomButton";

export default function HomeScreen() {

    const navigation =
        useNavigation();

    return (
        <SafeAreaView
            style={globalStyles.screen}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }

                contentContainerStyle={{
                    paddingBottom: 40,
                }}
            >
                <View
                    style={globalStyles.topAccent}
                />

                <View style={globalStyles.container}>
                    <View
                        style={
                            globalStyles.headerContainer
                        }
                    >
                        <Text style={globalStyles.title}>NestVet</Text>

                        <Text style={globalStyles.subtitle}>
                            the future of vet care, delivered to you
                        </Text>
                    </View>

                    <View style={styles.grid}>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("AdminPets")
                            }
                        >
                            <Text style={styles.number}>
                                12
                            </Text>

                            <Text style={styles.label}>
                                PETS
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("Staff")
                            }
                        >
                            <Text style={styles.number}>
                                04
                            </Text>

                            <Text style={styles.label}>
                                STAFF
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.goldCard}
                            onPress={() =>
                                navigation.navigate("OnlineStatus")
                            }
                        >
                            <Text style={styles.goldText}>
                                ONLINE
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate(
                                    "Bookings"
                                )
                            }
                        >
                            <Text style={styles.number}>
                                08
                            </Text>

                            <Text style={styles.label}>
                                BOOKINGS
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View
                        style={globalStyles.section}
                    >
                        <Text style={styles.sectionTitle}>
                            QUICK ACTIONS
                        </Text>

                        <CustomButton
                            title="BOOK APPOINTMENT"
                            onPress={() =>
                                navigation.navigate(
                                    "BookAppointment"
                                )
                            }
                        />

                        <CustomButton
                            title="VIEW PETS"
                            variant="secondary"
                            onPress={() =>
                                navigation.navigate(
                                    "AdminPets"
                                )
                            }
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    card: {
        width: "48%",
        height: 128,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        justifyContent: "space-between",
        borderBottomWidth: 4,
        borderBottomColor: colors.red,
    },

    goldCard: {
        width: "48%",
        height: 128,
        backgroundColor: colors.surfaceGoldTint,
        borderWidth: 1,
        borderColor: colors.goldMuted,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 4,
        borderBottomColor: colors.gold,
    },

    number: {
        fontSize: 32,
        color: colors.red,
        fontWeight: "800",
    },

    label: {
        color: colors.textSecondary,
        fontWeight: "800",
        letterSpacing: 1.2,
        fontSize: 12,
    },

    goldText: {
        color: colors.darkRed,
        fontWeight: "800",
        fontSize: 18,
        letterSpacing: 2,
    },

    sectionTitle: {
        fontSize: 13,
        fontWeight: "800",
        color: colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
});
