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
import DropdownPicker from "../components/DropdownPicker";

export const SERVICE_OPTIONS = [
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

const INITIAL_BOOKINGS = [
    { id: "1", petName: "MILO",    date: "MAY 13, 2026", service: "GENERAL CHECKUP" },
    { id: "2", petName: "LUNA",    date: "MAY 14, 2026", service: "VACCINATION"      },
    { id: "3", petName: "BUDDY",   date: "MAY 15, 2026", service: "DENTAL CLEANING"  },
    { id: "4", petName: "BELLA",   date: "MAY 16, 2026", service: "SPAY / NEUTER"    },
    { id: "5", petName: "CHARLIE", date: "MAY 17, 2026", service: "GROOMING"         },
    { id: "6", petName: "DAISY",   date: "MAY 18, 2026", service: "DEWORMING"        },
    { id: "7", petName: "ROCKY",   date: "MAY 19, 2026", service: "EAR CLEANING"     },
    { id: "8", petName: "COCO",    date: "MAY 20, 2026", service: "BLOOD TEST"       },
];

let nextId = 9;

function BookingRow({ booking, onEdit, onDelete }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardAccent} />

            <View style={styles.cardBody}>
                <View style={styles.cardMain}>
                    <Text style={styles.cardPetName}>{booking.petName}</Text>
                    <Text style={styles.cardInfo}>📅 {booking.date}</Text>
                    <Text style={styles.cardInfo}>🩺 {booking.service}</Text>
                </View>

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.editBtn]}
                        onPress={() => onEdit(booking)}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.actionBtnText}>✎</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={() => onDelete(booking)}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.actionBtnText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function BookingsScreen() {
    const [bookings, setBookings]         = useState(INITIAL_BOOKINGS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing]           = useState(null);
    const [form, setForm]                 = useState({ petName: "", date: "", service: "" });

    /* ── open modal ── */
    function openAdd() {
        setEditing(null);
        setForm({ petName: "", date: "", service: "" });
        setModalVisible(true);
    }

    function openEdit(booking) {
        setEditing(booking);
        setForm({ petName: booking.petName, date: booking.date, service: booking.service });
        setModalVisible(true);
    }

    /* ── save ── */
    function handleSave() {
        const petName = form.petName.trim().toUpperCase();
        const date    = form.date.trim().toUpperCase();

        if (!petName || !date || !form.service) {
            Alert.alert("MISSING INFO", "Please fill in all fields.");
            return;
        }

        if (editing) {
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === editing.id
                        ? { ...b, petName, date, service: form.service }
                        : b
                )
            );
        } else {
            setBookings((prev) => [
                ...prev,
                { id: String(nextId++), petName, date, service: form.service },
            ]);
        }

        setModalVisible(false);
    }

    /* ── delete ── */
    function handleDelete(booking) {
        Alert.alert(
            "CANCEL BOOKING",
            `Remove booking for ${booking.petName} on ${booking.date}?`,
            [
                { text: "KEEP", style: "cancel" },
                {
                    text: "REMOVE",
                    style: "destructive",
                    onPress: () =>
                        setBookings((prev) =>
                            prev.filter((b) => b.id !== booking.id)
                        ),
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
                            <Text style={globalStyles.title}>BOOKINGS</Text>
                            <Text style={globalStyles.subtitle}>
                                {bookings.length} APPOINTMENTS SCHEDULED
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

                    <Text style={styles.sectionTitle}>UPCOMING APPOINTMENTS</Text>

                    {bookings.length === 0 ? (
                        <View style={globalStyles.section}>
                            <Text style={styles.emptyText}>
                                NO BOOKINGS YET.
                            </Text>
                        </View>
                    ) : (
                        bookings.map((booking) => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
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
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editing ? "EDIT BOOKING" : "ADD BOOKING"}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <InputField
                                label="PET NAME"
                                placeholder="e.g. MILO"
                                value={form.petName}
                                onChangeText={(t) =>
                                    setForm((f) => ({ ...f, petName: t }))
                                }
                                autoCapitalize="characters"
                            />

                            <InputField
                                label="DATE"
                                placeholder="e.g. MAY 25, 2026"
                                value={form.date}
                                onChangeText={(t) =>
                                    setForm((f) => ({ ...f, date: t }))
                                }
                                autoCapitalize="characters"
                            />

                            <DropdownPicker
                                label="SERVICE"
                                value={form.service}
                                options={SERVICE_OPTIONS}
                                placeholder="SELECT SERVICE"
                                onSelect={(val) =>
                                    setForm((f) => ({ ...f, service: val }))
                                }
                            />

                            <CustomButton
                                title={editing ? "SAVE CHANGES" : "ADD BOOKING"}
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

    card: {
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: colors.black,
        borderRadius: 10,
        marginBottom: 12,
        overflow: "hidden",
    },

    cardAccent: {
        height: 10,
        backgroundColor: colors.red,
        borderBottomWidth: 3,
        borderBottomColor: colors.black,
    },

    cardBody: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
    },

    cardMain: {
        flex: 1,
    },

    cardPetName: {
        fontSize: 16,
        fontWeight: "900",
        color: colors.black,
        letterSpacing: 0.5,
        marginBottom: 4,
    },

    cardInfo: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkRed,
        marginTop: 2,
    },

    cardActions: {
        flexDirection: "column",
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
        marginTop: 6,
    },

    editBtn:   { backgroundColor: colors.gold },
    deleteBtn: { backgroundColor: colors.red  },

    actionBtnText: {
        fontWeight: "900",
        fontSize: 14,
        color: colors.white,
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
