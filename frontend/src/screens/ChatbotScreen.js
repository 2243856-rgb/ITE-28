import React from "react";

import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
} from "react-native";

import globalStyles
    from "../theme/globalStyles";

import colors
    from "../theme/colors/theme";

export default function ChatbotScreen() {
    return (
        <SafeAreaView
            style={globalStyles.screen}
        >
            <Text style={globalStyles.title}>
                PET BOT
            </Text>

            <Text style={globalStyles.subtitle}>
                AI ASSISTANT
            </Text>

            <View style={styles.chatBox}>
                <Text style={styles.chatText}>
                    HOW CAN I HELP YOU?
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    chatBox: {
        backgroundColor: colors.white,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 10,

        padding: 20,
    },

    chatText: {
        color: colors.darkRed,

        fontWeight: "700",

        letterSpacing: 1,
    },
});