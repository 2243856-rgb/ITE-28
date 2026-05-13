import React, { useState } from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Alert,
} from "react-native";

import InputField
    from "../components/InputField";

import CustomButton
    from "../components/CustomButton";

import globalStyles
    from "../theme/globalStyles";

import colors
    from "../theme/colors/theme";

import {
    loginUser,
} from "../services/auth.service";

export default function LoginScreen({
                                        navigation,
                                    }) {
    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleLogin = () => {
        const result = loginUser(
            email,
            password
        );

        if (result.success) {
            navigation.replace("Main");
        } else {
            Alert.alert(
                "LOGIN FAILED",
                result.message
            );
        }
    };

    return (
        <SafeAreaView
            style={globalStyles.screen}
        >
            <View style={globalStyles.topAccent} />

            <View style={globalStyles.container}>
                <View
                    style={
                        globalStyles.headerContainer
                    }
                >
                    <Text
                        style={globalStyles.title}
                    >
                        PET CARE
                    </Text>

                    <Text
                        style={
                            globalStyles.subtitle
                        }
                    >
                        RETRO PET MANAGEMENT
                    </Text>
                </View>

                <View
                    style={globalStyles.section}
                >
                    <InputField
                        label="EMAIL"
                        placeholder="ENTER EMAIL"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <InputField
                        label="PASSWORD"
                        placeholder="ENTER PASSWORD"
                        secureTextEntry
                        value={password}
                        onChangeText={
                            setPassword
                        }
                    />

                    <CustomButton
                        title="LOGIN"
                        onPress={handleLogin}
                    />

                    <CustomButton
                        title="REGISTER"
                        variant="secondary"
                        onPress={() =>
                            navigation.navigate(
                                "Register"
                            )
                        }
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        8BIT RETRO UI
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    footer: {
        marginTop: 10,

        alignItems: "center",
    },

    footerText: {
        color: colors.darkRed,

        fontWeight: "800",

        letterSpacing: 2,

        fontSize: 12,
    },
});
