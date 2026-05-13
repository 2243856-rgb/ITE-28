import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Alert,
    StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import DropdownPicker from "../components/DropdownPicker";
import colors from "../theme/colors/theme";
import { DEFAULT_CLINIC_ID } from "../config/env";
import { fetchPets } from "../services/pets.api";
import { createAppointmentRequest } from "../services/appointments.api";

function petLabel(p) {
    return `${p.petName} (${p.species})`;
}

export default function BookAppointmentScreen() {
    const navigation = useNavigation();
    const [pets, setPets] = useState([]);
    const [petPickerValue, setPetPickerValue] = useState("");
    const [petId, setPetId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reason, setReason] = useState("");

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const res = await fetchPets();
                if (!res.ok) return;
                setPets(res.items);
                setPetId((pid) => {
                    if (pid) return pid;
                    if (res.items.length === 1) return res.items[0].petId;
                    return pid;
                });
                setPetPickerValue((pv) => {
                    if (pv) return pv;
                    if (res.items.length === 1) return petLabel(res.items[0]);
                    return pv;
                });
            })();
        }, [])
    );

    const petOptions = pets.map(petLabel);

    const onPickPet = (label) => {
        setPetPickerValue(label);
        const p = pets.find((x) => petLabel(x) === label);
        setPetId(p ? p.petId : "");
    };

    const submit = async () => {
        if (!petId) {
            Alert.alert(
                "Choose a pet",
                "Add a pet under the Pets tab first, then try again."
            );
            return;
        }
        if (!startDate.trim() || !startTime.trim() || !endTime.trim()) {
            Alert.alert(
                "Date & time",
                "Use date YYYY-MM-DD and 24h times HH:MM for start and end."
            );
            return;
        }

        const startIso = new Date(`${startDate.trim()}T${startTime.trim()}:00`);
        const endIso = new Date(`${startDate.trim()}T${endTime.trim()}:00`);
        if (Number.isNaN(startIso.getTime()) || Number.isNaN(endIso.getTime())) {
            Alert.alert("Invalid date/time", "Check the format and try again.");
            return;
        }
        if (endIso <= startIso) {
            Alert.alert("Invalid range", "End time must be after start time.");
            return;
        }

        const res = await createAppointmentRequest({
            petId,
            clinicId: DEFAULT_CLINIC_ID,
            appointmentType: "CLINIC_VISIT",
            scheduledStart: startIso.toISOString(),
            scheduledEnd: endIso.toISOString(),
            reason: reason.trim() || null,
        });

        if (!res.ok) {
            Alert.alert("Booking failed", res.message);
            return;
        }

        Alert.alert("Booked", "Your appointment request was saved.", [
            {
                text: "OK",
                onPress: () => navigation.goBack(),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.topAccent} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 48 }}
            >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Book visit</Text>
                        <Text style={styles.subtitle}>
                            In-clinic appointment (MVP — one default clinic).
                        </Text>
                    </View>

                    {pets.length === 0 ? (
                        <Text style={styles.warn}>
                            You do not have any pets on file yet. Add a pet from
                            the Pets tab, then return here.
                        </Text>
                    ) : null}

                    <DropdownPicker
                        label="PET"
                        value={petPickerValue}
                        options={petOptions}
                        onSelect={onPickPet}
                        placeholder="SELECT PET"
                    />

                    <InputField
                        label="DATE (YYYY-MM-DD)"
                        placeholder="2026-05-20"
                        value={startDate}
                        onChangeText={setStartDate}
                    />
                    <InputField
                        label="START TIME (24H)"
                        placeholder="09:00"
                        value={startTime}
                        onChangeText={setStartTime}
                    />
                    <InputField
                        label="END TIME (24H)"
                        placeholder="10:00"
                        value={endTime}
                        onChangeText={setEndTime}
                    />
                    <InputField
                        label="REASON (OPTIONAL)"
                        placeholder="Annual checkup, vaccines…"
                        value={reason}
                        onChangeText={setReason}
                    />

                    <View style={styles.spacer} />
                    <CustomButton title="CONFIRM BOOKING" onPress={submit} />
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
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textSecondary,
        marginTop: 6,
        lineHeight: 20,
    },
    warn: {
        color: colors.darkRed,
        fontWeight: "700",
        marginBottom: 12,
        lineHeight: 20,
    },
    spacer: {
        height: 8,
    },
});
