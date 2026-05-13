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

const STATUS_OPTIONS = ["ON DUTY", "OFF DUTY"];

const ROLE_OPTIONS = [
    "HEAD VETERINARIAN",
    "VETERINARIAN",
    "VET NURSE",
    "RECEPTIONIST",
    "PET GROOMER",
];

const INITIAL_STAFF = [
    { id: "1", name: "DR. SANTOS",    role: "HEAD VETERINARIAN", status: "ON DUTY"  },
    { id: "2", name: "DR. REYES",     role: "VETERINARIAN",      status: "ON DUTY"  },
    { id: "3", name: "NURSE DELA CRUZ", role: "VET NURSE",       status: "OFF DUTY" },
    { id: "4", name: "NURSE GARCIA",  role: "VET NURSE",         status: "ON DUTY"  },
];

let nextId = 5;

function StaffRow({ staff, onEdit, onDelete }) {
    const isOnDuty = staff.status === "ON DUTY";

    return (
        <View style={styles.row}>
            <View style={[styles.avatar, isOnDuty ? styles.avatarOn : styles.avatarOff]}>
                <Text style={styles.avatarText}>
                    {staff.name.charAt(0)}
                </Text>
            </View>

            <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{staff.name}</Text>
                <Text style={styles.rowRole}>{staff.role}</Text>
            </View>

            <View style={[styles.badge, isOnDuty ? styles.badgeOn : styles.badgeOff]}>
                <Text style={[styles.badgeText, isOnDuty ? styles.badgeTextOn : styles.badgeTextOff]}>
                    {staff.status}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => onEdit(staff)}
                    activeOpacity={0.75}
                >
                    <Text style={styles.actionBtnText}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => onDelete(staff)}
                    activeOpacity={0.75}
                >
                    <Text style={styles.actionBtnText}>✕</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function StaffScreen() {
    const [staff, setStaff]             = useState(INITIAL_STAFF);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing]         = useState(null);
    const [form, setForm]               = useState({ name: "", role: "", status: "" });

    /* ── open modal ── */
    function openAdd() {
        setEditing(null);
        setForm({ name: "", role: "", status: "" });
        setModalVisible(true);
    }

    function openEdit(member) {
        setEditing(member);
        setForm({ name: member.name, role: member.role, status: member.status });
        setModalVisible(true);
    }

    /* ── save ── */
    function handleSave() {
        const name = form.name.trim().toUpperCase();

        if (!name || !form.role || !form.status) {
            Alert.alert("MISSING INFO", "Please fill in all fields.");
            return;
        }

        if (editing) {
            setStaff((prev) =>
                prev.map((s) =>
                    s.id === editing.id
                        ? { ...s, name, role: form.role, status: form.status }
                        : s
                )
            );
        } else {
            setStaff((prev) => [
                ...prev,
                { id: String(nextId++), name, role: form.role, status: form.status },
            ]);
        }

        setModalVisible(false);
    }

    /* ── delete ── */
    function handleDelete(member) {
        Alert.alert(
            "REMOVE STAFF",
            `Remove ${member.name} from the roster?`,
            [
                { text: "CANCEL", style: "cancel" },
                {
                    text: "REMOVE",
                    style: "destructive",
                    onPress: () =>
                        setStaff((prev) =>
                            prev.filter((s) => s.id !== member.id)
                        ),
                },
            ]
        );
    }

    const onDutyCount = staff.filter((s) => s.status === "ON DUTY").length;

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
                            <Text style={globalStyles.title}>STAFF</Text>
                            <Text style={globalStyles.subtitle}>
                                {onDutyCount} OF {staff.length} ON DUTY
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

                    <Text style={styles.sectionTitle}>STAFF ROSTER</Text>

                    <View style={globalStyles.section}>
                        {staff.length === 0 ? (
                            <Text style={styles.emptyText}>
                                NO STAFF MEMBERS ADDED YET.
                            </Text>
                        ) : (
                            staff.map((member, idx) => (
                                <View key={member.id}>
                                    <StaffRow
                                        staff={member}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                    />
                                    {idx < staff.length - 1 && (
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
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editing ? "EDIT STAFF" : "ADD STAFF MEMBER"}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <InputField
                                label="FULL NAME"
                                placeholder="e.g. DR. JUAN DELA CRUZ"
                                value={form.name}
                                onChangeText={(t) =>
                                    setForm((f) => ({ ...f, name: t }))
                                }
                                autoCapitalize="characters"
                            />

                            <DropdownPicker
                                label="ROLE"
                                value={form.role}
                                options={ROLE_OPTIONS}
                                placeholder="SELECT ROLE"
                                onSelect={(val) =>
                                    setForm((f) => ({ ...f, role: val }))
                                }
                            />

                            <DropdownPicker
                                label="STATUS"
                                value={form.status}
                                options={STATUS_OPTIONS}
                                placeholder="SELECT STATUS"
                                onSelect={(val) =>
                                    setForm((f) => ({ ...f, status: val }))
                                }
                            />

                            <CustomButton
                                title={editing ? "SAVE CHANGES" : "ADD STAFF"}
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

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    avatarOn:  { backgroundColor: colors.red },
    avatarOff: { backgroundColor: colors.border },

    avatarText: {
        color: colors.white,
        fontWeight: "900",
        fontSize: 17,
    },

    rowInfo: {
        flex: 1,
    },

    rowName: {
        fontWeight: "900",
        fontSize: 13,
        color: colors.black,
        letterSpacing: 0.4,
    },

    rowRole: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.darkRed,
        marginTop: 2,
        letterSpacing: 0.3,
    },

    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 2,
        marginRight: 8,
    },

    badgeOn: {
        backgroundColor: colors.gold,
        borderColor: colors.black,
    },

    badgeOff: {
        backgroundColor: colors.background,
        borderColor: colors.border,
    },

    badgeText: {
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 0.4,
    },

    badgeTextOn:  { color: colors.black },
    badgeTextOff: { color: colors.darkRed },

    actions: {
        flexDirection: "row",
        alignItems: "center",
    },

    actionBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 6,
    },

    editBtn:   { backgroundColor: colors.gold },
    deleteBtn: { backgroundColor: colors.red  },

    actionBtnText: {
        fontWeight: "900",
        fontSize: 13,
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
