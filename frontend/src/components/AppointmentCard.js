import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import colors from "../theme/colors/theme";

export default function AppointmentCard({
                                            petName,
                                            date,
                                            service,
                                        }) {
    return (
        <View style={styles.card}>
            <View style={styles.topBar} />

            <Text style={styles.petName}>
                {petName}
            </Text>

            <Text style={styles.info}>
                DATE: {date}
            </Text>

            <Text style={styles.info}>
                SERVICE: {service}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 10,

        marginBottom: 16,

        overflow: "hidden",
    },

    topBar: {
        height: 14,
        backgroundColor: colors.red,

        borderBottomWidth: 3,
        borderBottomColor: colors.black,
    },

    petName: {
        fontSize: 18,
        fontWeight: "900",

        color: colors.black,

        marginTop: 14,
        marginHorizontal: 14,
        marginBottom: 10,
    },

    info: {
        fontSize: 14,

        color: colors.darkRed,

        marginHorizontal: 14,
        marginBottom: 10,

        fontWeight: "700",
    },
});