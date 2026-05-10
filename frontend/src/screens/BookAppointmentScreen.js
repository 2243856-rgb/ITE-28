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
import DropdownPicker from "../components/DropdownPicker";
import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";

const SERVICE_OPTIONS = [
    "GENERAL CHECKUP",
    "VACCINATION",
    "DENTAL CLEANING",
    "SPAY / NEUTER",
    "GROOMING",
    "DEWORMING",
    "EAR CLEANING",
    "BLOOD TEST",
    "X-RAY",
    "SURGERY CONSULTATION",
];

export default function BookAppointmentScreen() {
    const [petName,  setPetName]  = useState("");
    const [date,     setDate]     = useState("");
    const [service,  setService]  = useState("");

    function handleConfirm() {
        const trimmedPet     = petName.trim();
        const trimmedDate    = date.trim();
        const selectedService = service;

        if (!trimmedPet || !trimmedDate || !selectedService) {
            Alert.alert("MISSING INFO", "Please fill in all fields before confirming.");
            return;
        }

        Alert.alert(
            "APPOINTMENT BOOKED",
            `Appointment for ${trimmedPet.toUpperCase()} on ${trimmedDate.toUpperCase()} (${selectedService}) has been confirmed.`,
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
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                <View style={globalStyles.container}>
                    <View style={globalStyles.headerContainer}>
                        <Text style={globalStyles.title}>BOOK</Text>
                        <Text style={globalStyles.subtitle}>APPOINTMENT FORM</Text>
                    </View>

                    <View style={[globalStyles.section, styles.formCard]}>
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

                        <DropdownPicker
                            label="SERVICE"
                            value={service}
                            options={SERVICE_OPTIONS}
                            placeholder="SELECT SERVICE"
                            onSelect={(val) => setService(val)}
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
    formCard: {
        marginTop: 4,
    },

    spacer: {
        height: 8,
    },
});