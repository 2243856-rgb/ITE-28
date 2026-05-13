import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import colors from "../theme/colors/theme";

export default function DropdownPicker({
    label,
    value,
    options = [],
    onSelect,
    placeholder = "SELECT AN OPTION",
}) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.trigger}
                onPress={() => setOpen(true)}
            >
                <Text style={[styles.triggerText, !value && styles.placeholder]}>
                    {value || placeholder}
                </Text>
                <Text style={styles.arrow}>▾</Text>
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.sheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>
                                {label || "SELECT"}
                            </Text>
                            <TouchableOpacity onPress={() => setOpen(false)}>
                                <Text style={styles.closeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item === value && styles.optionSelected,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item === value && styles.optionTextSelected,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                    {item === value && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={styles.separator} />
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },

    label: {
        marginBottom: 8,
        color: colors.darkRed,
        fontWeight: "800",
        letterSpacing: 1,
        fontSize: 13,
    },

    trigger: {
        height: 56,
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: colors.black,
        borderRadius: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    triggerText: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.black,
    },

    placeholder: {
        color: "#777",
        fontWeight: "600",
    },

    arrow: {
        fontSize: 18,
        color: colors.darkRed,
        fontWeight: "900",
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },

    sheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderColor: colors.black,
        maxHeight: "70%",
        paddingBottom: 30,
    },

    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 18,
        borderBottomWidth: 3,
        borderBottomColor: colors.black,
        backgroundColor: colors.red,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },

    sheetTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: colors.white,
        letterSpacing: 1,
    },

    closeBtn: {
        fontSize: 18,
        fontWeight: "900",
        color: colors.white,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },

    optionSelected: {
        backgroundColor: colors.background,
    },

    optionText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.black,
        letterSpacing: 0.5,
    },

    optionTextSelected: {
        color: colors.darkRed,
        fontWeight: "900",
    },

    checkmark: {
        fontSize: 16,
        fontWeight: "900",
        color: colors.gold,
    },

    separator: {
        height: 2,
        backgroundColor: colors.border,
        marginHorizontal: 20,
    },
});
