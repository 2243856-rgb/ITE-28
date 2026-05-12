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
                        <Text
                            style={globalStyles.title}
                        >
                            DASHBOARD
                        </Text>

                        <Text
                            style={
                                globalStyles.subtitle
                            }
                        >
                            PET SYSTEM STATUS
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

        justifyContent:
            "space-between",

        marginBottom: 8,
    },

    card: {
        width: "48%",

        height: 130,

        backgroundColor: colors.red,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 12,

        padding: 18,

        marginBottom: 16,

        justifyContent:
            "space-between",
    },

    goldCard: {
        width: "48%",

        height: 130,

        backgroundColor: colors.gold,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 12,

        padding: 18,

        marginBottom: 16,

        justifyContent: "center",

        alignItems: "center",
    },

    number: {
        fontSize: 34,

        color: colors.white,

        fontWeight: "900",
    },

    label: {
        color: colors.white,

        fontWeight: "800",

        letterSpacing: 1,
    },

    goldText: {
        color: colors.black,

        fontWeight: "900",

        fontSize: 22,

        letterSpacing: 2,
    },

    sectionTitle: {
        fontSize: 16,

        fontWeight: "900",

        color: colors.black,

        letterSpacing: 1,

        marginBottom: 6,
    },
});
