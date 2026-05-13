import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Alert,
    StyleSheet,
} from "react-native";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import colors from "../theme/colors/theme";

export default function BookAppointmentScreen() {
    const [petName, setPetName] = useState("");
    const [date, setDate] = useState("");
    const [service, setService] = useState("");

    function handleConfirm() {
        const trimmedPet = petName.trim();
        const trimmedDate = date.trim();
        const selectedService = service.trim();

        if (!trimmedPet || !trimmedDate || !selectedService) {
            Alert.alert(
                "Missing information",
                "Please fill in all fields before confirming."
            );
            return;
        }

        Alert.alert(
            "Appointment booked",
            `Appointment for ${trimmedPet} on ${trimmedDate} (${selectedService}) is confirmed.`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        setPetName("");
                        setDate("");
                        setService("");
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.topAccent} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Book</Text>
                        <Text style={styles.subtitle}>New appointment</Text>
                    </View>

                    <View style={styles.formCard}>
                        <InputField
                            label="PET NAME"
                            placeholder="e.g. Milo"
                            value={petName}
                            onChangeText={setPetName}
                            autoCapitalize="characters"
                        />
                        <InputField
                            label="DATE"
                            placeholder="e.g. May 25, 2026"
                            value={date}
                            onChangeText={setDate}
                            autoCapitalize="characters"
                        />
                        <InputField
                            label="SERVICE"
                            placeholder="e.g. Vaccination"
                            value={service}
                            onChangeText={setService}
                            autoCapitalize="characters"
                        />
                        <View style={styles.spacer} />
                        <CustomButton
                            title="CONFIRM BOOKING"
                            onPress={handleConfirm}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    topAccent: {
        height: 4,
        backgroundColor: colors.gold,
    },
    container: {
        paddingHorizontal: 22,
        paddingTop: 8,
    },
    headerContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.textPrimary,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.textSecondary,
        letterSpacing: 1,
        marginTop: 6,
    },
    formCard: {
        marginTop: 4,
    },
    spacer: {
        height: 12,
    },
});
