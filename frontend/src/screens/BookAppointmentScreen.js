import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Alert,
    StyleSheet,
    Platform,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import DropdownPicker from "../components/DropdownPicker";
import colors from "../theme/colors/theme";
import { DEFAULT_CLINIC_ID } from "../config/env";
import { fetchPets } from "../services/pets.api";
import { createAppointmentRequest } from "../services/appointments.api";

/** Animal-type options for booking (must match pet species on file, or use "Other"). */
const PET_ANIMAL_TYPES = [
    "Dog",
    "Cat",
    "Rabbit",
    "Hamster / gerbil / mouse",
    "Guinea pig",
    "Bird",
    "Fish",
    "Reptile",
    "Ferret",
    "Horse",
    "Other",
];

function resolvePetsForAnimalType(allPets, animalTypeLabel) {
    if (!animalTypeLabel) return [];
    if (animalTypeLabel === "Other") return allPets;
    const target = animalTypeLabel.trim().toLowerCase();
    return allPets.filter(
        (p) => (p.species || "").trim().toLowerCase() === target
    );
}

function petPickLabel(p) {
    const breed = p.breed ? ` · ${p.breed}` : "";
    return `${p.petName} (${p.species})${breed}`;
}

export default function BookAppointmentScreen() {
    const navigation = useNavigation();
    const [pets, setPets] = useState([]);
    const [animalType, setAnimalType] = useState("");
    const [petPickerValue, setPetPickerValue] = useState("");
    const [petId, setPetId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reason, setReason] = useState("");

    const matchingPets = resolvePetsForAnimalType(pets, animalType);
    /** Always show pet dropdown when there is at least one matching pet (not only when 2+). */
    const showPetPicker = Boolean(animalType && matchingPets.length >= 1);
    const petOptions = matchingPets.map(petPickLabel);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const res = await fetchPets();
                if (!res.ok) return;
                setPets(res.items);
                const matches = resolvePetsForAnimalType(
                    res.items,
                    animalType
                );
                if (animalType && matches.length === 1) {
                    setPetId(matches[0].petId);
                    setPetPickerValue(petPickLabel(matches[0]));
                }
            })();
        }, [animalType])
    );

    const onPickAnimalType = (label) => {
        setAnimalType(label);
        const matches = resolvePetsForAnimalType(pets, label);
        if (matches.length === 1) {
            setPetId(matches[0].petId);
            setPetPickerValue(petPickLabel(matches[0]));
        } else {
            setPetId("");
            setPetPickerValue("");
        }
    };

    const onPickPet = (label) => {
        setPetPickerValue(label);
        const p = matchingPets.find((x) => petPickLabel(x) === label);
        setPetId(p ? p.petId : "");
    };

    const confirmBody = (title, message, onOk) => {
        if (Platform.OS === "web") {
            const ok =
                typeof globalThis.confirm === "function"
                    ? globalThis.confirm(`${title}\n\n${message}`)
                    : true;
            if (ok) onOk();
            return;
        }
        Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
    };

    const submit = async () => {
        if (!petId) {
            if (!animalType) {
                Alert.alert(
                    "Animal type",
                    "Choose the type of animal for this visit."
                );
                return;
            }
            if (pets.length === 0) {
                Alert.alert(
                    "No pets on file",
                    "Add a pet from the Pets tab first, then return here."
                );
                return;
            }
            if (matchingPets.length === 0) {
                Alert.alert(
                    "No matching pet",
                    `You have no pets saved as “${animalType}”. Add one under Pets using that animal type, or choose “Other” to pick from all your pets.`
                );
                return;
            }
            Alert.alert(
                "Choose your pet",
                "Select which pet this appointment is for."
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

        confirmBody("Booked", "Your appointment request was saved.", () =>
            navigation.goBack()
        );
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
                            From the Home tab, tap Book appointment to open this
                            screen. Pick an animal type, then use Select pet
                            (below) before choosing date and time.
                        </Text>
                    </View>

                    {pets.length === 0 ? (
                        <Text style={styles.warn}>
                            You do not have any pets on file yet. Add a pet from
                            the Pets tab, then return here.
                        </Text>
                    ) : null}

                    <DropdownPicker
                        label="ANIMAL TYPE"
                        value={animalType}
                        options={PET_ANIMAL_TYPES}
                        onSelect={onPickAnimalType}
                        placeholder="SELECT ANIMAL"
                    />

                    {pets.length > 0 && !animalType ? (
                        <Text style={styles.stepHint}>
                            Next: choose an animal type, then the Select pet menu
                            appears directly under it.
                        </Text>
                    ) : null}

                    {animalType && matchingPets.length === 0 && pets.length > 0 ? (
                        <Text style={styles.warn}>
                            No pet on file matches “{animalType}”. Use the same
                            spelling under Pets when you add a pet, or choose
                            “Other” to see every pet you have saved.
                        </Text>
                    ) : null}

                    {showPetPicker ? (
                        <DropdownPicker
                            label="SELECT PET"
                            value={petPickerValue}
                            options={petOptions}
                            onSelect={onPickPet}
                            placeholder="SELECT PET"
                        />
                    ) : null}

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
    stepHint: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.textSecondary,
        marginBottom: 14,
        lineHeight: 19,
    },
    spacer: {
        height: 8,
    },
});
