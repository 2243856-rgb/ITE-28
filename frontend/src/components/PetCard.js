import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import colors from "../theme/colors/theme";

export default function PetCard({
                                    petName,
                                    breed,
                                }) {
    return (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>
                    PET
                </Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name}>
                    {petName}
                </Text>

                <Text style={styles.breed}>
                    {breed}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: colors.white,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 10,

        padding: 14,

        marginBottom: 14,
    },

    iconBox: {
        width: 70,
        height: 70,

        backgroundColor: colors.gold,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 8,

        alignItems: "center",
        justifyContent: "center",

        marginRight: 14,
    },

    icon: {
        fontWeight: "900",
        color: colors.black,
    },

    infoContainer: {
        flex: 1,
    },

    name: {
        fontSize: 18,
        fontWeight: "900",

        color: colors.black,

        marginBottom: 6,
    },

    breed: {
        fontSize: 14,

        color: colors.darkRed,

        fontWeight: "700",
    },
});