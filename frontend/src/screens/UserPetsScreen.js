import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { fetchPets, createPetRequest } from "../services/pets.api";

export default function UserPetsScreen() {
    const [items, setItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [petName, setPetName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");

    const load = useCallback(async () => {
        const res = await fetchPets();
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

    const openAdd = () => {
        setPetName("");
        setSpecies("");
        setBreed("");
        setModalOpen(true);
    };

    const savePet = async () => {
        const name = petName.trim();
        const sp = species.trim();
        if (!name || !sp) {
            Alert.alert("Missing info", "Pet name and species are required.");
            return;
        }
        const res = await createPetRequest({
            petName: name,
            species: sp,
            breed: breed.trim() || undefined,
        });
        if (!res.ok) {
            Alert.alert("Could not save", res.message);
            return;
        }
        setModalOpen(false);
        await load();
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />
            <View style={styles.headerRow}>
                <View>
                    <Text style={globalStyles.title}>My pets</Text>
                    <Text style={globalStyles.subtitle}>
                        Add profiles for care and booking.
                    </Text>
                </View>
                <TouchableOpacity style={styles.addFab} onPress={openAdd}>
                    <Text style={styles.addFabText}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.petId}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        No pets yet. Tap + to add your first pet.
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.accent} />
                        <View style={styles.cardBody}>
                            <Text style={styles.petName}>{item.petName}</Text>
                            <Text style={styles.meta}>
                                {item.species}
                                {item.breed ? ` · ${item.breed}` : ""}
                            </Text>
                        </View>
                    </View>
                )}
            />

            <Modal visible={modalOpen} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>Add pet</Text>
                        <InputField
                            label="NAME"
                            placeholder="e.g. Milo"
                            value={petName}
                            onChangeText={setPetName}
                        />
                        <InputField
                            label="SPECIES"
                            placeholder="e.g. Dog"
                            value={species}
                            onChangeText={setSpecies}
                        />
                        <InputField
                            label="BREED (OPTIONAL)"
                            placeholder="e.g. Golden Retriever"
                            value={breed}
                            onChangeText={setBreed}
                        />
                        <CustomButton title="SAVE PET" onPress={savePet} />
                        <CustomButton
                            title="CANCEL"
                            variant="secondary"
                            onPress={() => setModalOpen(false)}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 22,
        paddingTop: 8,
        marginBottom: 8,
    },
    addFab: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 3,
        borderBottomColor: colors.darkRed,
    },
    addFabText: {
        color: colors.white,
        fontSize: 28,
        fontWeight: "700",
        marginTop: -2,
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        color: colors.textMuted,
        fontSize: 15,
        paddingHorizontal: 20,
    },
    card: {
        flexDirection: "row",
        backgroundColor: colors.surfaceElevated,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
    },
    accent: {
        width: 4,
        backgroundColor: colors.primary,
    },
    cardBody: {
        flex: 1,
        padding: 16,
    },
    petName: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.textPrimary,
    },
    meta: {
        marginTop: 4,
        fontSize: 14,
        color: colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 22,
        paddingBottom: 32,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 12,
        color: colors.textPrimary,
    },
});
