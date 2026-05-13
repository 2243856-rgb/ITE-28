import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const INITIAL_PETS = [
    { id: "1",  petName: "MILO",    breed: "GOLDEN RETRIEVER" },
    { id: "2",  petName: "LUNA",    breed: "PERSIAN CAT"      },
    { id: "3",  petName: "BUDDY",   breed: "LABRADOR"         },
    { id: "4",  petName: "BELLA",   breed: "BEAGLE"           },
    { id: "5",  petName: "CHARLIE", breed: "SHIH TZU"         },
    { id: "6",  petName: "DAISY",   breed: "MALTESE"          },
    { id: "7",  petName: "ROCKY",   breed: "GERMAN SHEPHERD"  },
    { id: "8",  petName: "COCO",    breed: "POODLE"           },
    { id: "9",  petName: "MAX",     breed: "SIBERIAN HUSKY"   },
    { id: "10", petName: "SADIE",   breed: "DACHSHUND"        },
    { id: "11", petName: "DUKE",    breed: "BOXER"            },
    { id: "12", petName: "LILY",    breed: "RAGDOLL CAT"      },
];

let nextId = 13;

function PetRow({ pet, onEdit, onDelete }) {
    return (
        <View style={styles.row}>
            <View style={styles.iconBox}>
                <Text style={styles.iconText}>
                    {pet.petName.charAt(0)}
                </Text>
            </View>

            <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{pet.petName}</Text>
                <Text style={styles.rowBreed}>{pet.breed}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => onEdit(pet)}
                    activeOpacity={0.75}
                >
                    <Text style={styles.actionBtnText}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => onDelete(pet)}
                    activeOpacity={0.75}
                >
                    <Text style={styles.actionBtnText}>✕</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function PetsScreen() {
    const [pets, setPets]               = useState(INITIAL_PETS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing]         = useState(null); // null = adding
    const [form, setForm]               = useState({ petName: "", breed: "" });

    /* ── open modal ── */
    function openAdd() {
        setEditing(null);
        setForm({ petName: "", breed: "" });
        setModalVisible(true);
    }

    function openEdit(pet) {
        setEditing(pet);
        setForm({ petName: pet.petName, breed: pet.breed });
        setModalVisible(true);
    }

    /* ── save ── */
    function handleSave() {
        const name  = form.petName.trim().toUpperCase();
        const breed = form.breed.trim().toUpperCase();

        if (!name || !breed) {
            Alert.alert("MISSING INFO", "Please fill in both fields.");
            return;
        }

        if (editing) {
            setPets((prev) =>
                prev.map((p) =>
                    p.id === editing.id
                        ? { ...p, petName: name, breed }
                        : p
                )
            );
        } else {
            setPets((prev) => [
                ...prev,
                { id: String(nextId++), petName: name, breed },
            ]);
        }

        setModalVisible(false);
    }

    /* ── delete ── */
    function handleDelete(pet) {
        Alert.alert(
            "DELETE PET",
            `Remove ${pet.petName} from the registry?`,
            [
                { text: "CANCEL", style: "cancel" },
                {
                    text: "DELETE",
                    style: "destructive",
                    onPress: () =>
                        setPets((prev) => prev.filter((p) => p.id !== pet.id)),
                },
            ]
        );
    }

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={globalStyles.container}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={globalStyles.title}>PETS</Text>
                            <Text style={globalStyles.subtitle}>
                                {pets.length} REGISTERED PETS
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={openAdd}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addBtnText}>+ ADD</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>PET REGISTRY</Text>

                    <View style={globalStyles.section}>
                        {pets.length === 0 ? (
                            <Text style={styles.emptyText}>
                                NO PETS REGISTERED YET.
                            </Text>
                        ) : (
                            pets.map((pet, idx) => (
                                <View key={pet.id}>
                                    <PetRow
                                        pet={pet}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                    />
                                    {idx < pets.length - 1 && (
                                        <View style={styles.divider} />
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* ── CRUD Modal ── */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    />

                    <View style={styles.modalSheet}>
                        {/* Modal header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editing ? "EDIT PET" : "ADD NEW PET"}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <InputField
                                label="PET NAME"
                                placeholder="e.g. BRUNO"
                                value={form.petName}
                                onChangeText={(t) =>
                                    setForm((f) => ({ ...f, petName: t }))
                                }
                                autoCapitalize="characters"
                            />
                            <InputField
                                label="BREED"
                                placeholder="e.g. DALMATIAN"
                                value={form.breed}
                                onChangeText={(t) =>
                                    setForm((f) => ({ ...f, breed: t }))
                                }
                                autoCapitalize="characters"
                            />

                            <CustomButton
                                title={editing ? "SAVE CHANGES" : "ADD PET"}
                                onPress={handleSave}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    addBtn: {
        backgroundColor: colors.red,
        borderWidth: 3,
        borderColor: colors.black,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    addBtnText: {
        color: colors.white,
        fontWeight: "900",
        fontSize: 13,
        letterSpacing: 1,
    },

    sectionTitle: {
        fontSize: 13,
        fontWeight: "900",
        color: colors.darkRed,
        letterSpacing: 1,
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },

    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.gold,
        borderWidth: 2,
        borderColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    iconText: {
        fontWeight: "900",
        fontSize: 18,
        color: colors.black,
    },

    rowInfo: {
        flex: 1,
    },

    rowName: {
        fontWeight: "900",
        fontSize: 14,
        color: colors.black,
        letterSpacing: 0.5,
    },

    rowBreed: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.darkRed,
        marginTop: 2,
        letterSpacing: 0.4,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
    },

    actionBtn: {
        width: 34,
        height: 34,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    editBtn: {
        backgroundColor: colors.gold,
    },

    deleteBtn: {
        backgroundColor: colors.red,
    },

    actionBtnText: {
        fontWeight: "900",
        fontSize: 14,
        color: colors.white,
    },

    divider: {
        height: 2,
        backgroundColor: colors.border,
        marginHorizontal: 4,
    },

    emptyText: {
        textAlign: "center",
        color: colors.darkRed,
        fontWeight: "700",
        letterSpacing: 1,
        paddingVertical: 20,
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "flex-end",
    },

    modalSheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderColor: colors.black,
        overflow: "hidden",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 18,
        backgroundColor: colors.red,
    },

    modalTitle: {
        fontWeight: "900",
        fontSize: 16,
        color: colors.white,
        letterSpacing: 1,
    },

    modalClose: {
        fontWeight: "900",
        fontSize: 18,
        color: colors.white,
    },

    modalBody: {
        padding: 20,
        paddingBottom: 34,
    },
});
