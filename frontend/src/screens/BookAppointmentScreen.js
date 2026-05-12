import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Alert,
    StyleSheet,
} from "react-native";

import InputField   from "../components/InputField";
import CustomButton from "../components/CustomButton";

// NOTE: We removed DropdownPicker and theme imports because those files don't exist yet.

export default function BookAppointmentScreen() {
    const [petName,  setPetName]  = useState("");
    const [date,      setDate]      = useState("");
    const [service,  setService]  = useState("");

    function handleConfirm() {
        const trimmedPet     = petName.trim();
        const trimmedDate    = date.trim();
        const selectedService = service.trim();

        if (!trimmedPet || !trimmedDate || !selectedService) {
            Alert.alert("MISSING INFO", "Please fill in all fields before confirming.");
            return;
        }

        Alert.alert(
            "APPOINTMENT BOOKED",
            `Appointment for ${trimmedPet.toUpperCase()} on ${trimmedDate.toUpperCase()} (${selectedService.toUpperCase()}) has been confirmed.`,
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
                        <Text style={styles.title}>BOOK</Text>
                        <Text style={styles.subtitle}>APPOINTMENT FORM</Text>
                    </View>

                    <View style={styles.formCard}>
                        <InputField
                            label="PET NAME"
                            placeholder="e.g. MILO"
                            value={petName}
                            onChangeText={setPetName}
                            autoCapitalize="characters"
                        />

                        <InputField
                            label="DATE"
                            placeholder="e.g. MAY 25, 2026"
                            value={date}
                            onChangeText={setDate}
                            autoCapitalize="characters"
                        />

                        {/* Temporarily using InputField instead of DropdownPicker */}
                        <InputField
                            label="SERVICE"
                            placeholder="e.g. VACCINATION"
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
        backgroundColor: "#FFFFFF",
    },
    topAccent: {
        height: 5,
        backgroundColor: "#007BFF",
    },
    container: {
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000000",
    },
    subtitle: {
        fontSize: 18,
        color: "#666666",
    },
    formCard: {
        marginTop: 4,
    },
    spacer: {
        height: 20,
    },
});
