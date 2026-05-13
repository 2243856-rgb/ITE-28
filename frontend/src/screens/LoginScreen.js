import React, { useState } from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";

import InputField from "../components/InputField";

import CustomButton from "../components/CustomButton";

import globalStyles from "../theme/globalStyles";

import colors from "../theme/colors/theme";

import { loginUser } from "../services/auth.service";

/** Inline mark — no bundled PNG required (CI-safe). Drop `assets/images/nestvet-logo.png` into the repo and swap in `<Image source={require(...)} />` if you want the full artwork. */
function NestVetBrandMark() {
    return (
        <View style={styles.brandBlock} accessibilityRole="header">
            <View style={styles.logoRing}>
                <View style={styles.logoNest}>
                    <View style={styles.logoPet} />
                </View>
            </View>
            <Text style={styles.wordmark}>NestVet</Text>
            <Text style={styles.tagline}>
                the future of vet care, delivered to you
            </Text>
        </View>
    );
}

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = () => {
        const result = loginUser(email, password);

        if (result.success) {
            navigation.replace("Main");
        } else {
            Alert.alert("LOGIN FAILED", result.message);
        }
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={globalStyles.container}>
                    <NestVetBrandMark />

                    <View style={globalStyles.section}>
                        <InputField
                            label="EMAIL"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <InputField
                            label="PASSWORD"
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <CustomButton title="LOGIN" onPress={handleLogin} />

                        <CustomButton
                            title="REGISTER"
                            variant="secondary"
                            onPress={() => navigation.navigate("Register")}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerAccent}>—</Text>
                        <Text style={styles.footerMuted}>
                            Secure clinic access
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 32,
    },
    brandBlock: {
        alignItems: "center",
        marginBottom: 8,
        marginTop: 8,
    },
    logoRing: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 2,
        borderColor: colors.ink,
        backgroundColor: colors.surfaceElevated,
        alignItems: "center",
        justifyContent: "center",
    },
    logoNest: {
        width: 72,
        height: 48,
        borderRadius: 20,
        backgroundColor: colors.nestBrown,
        opacity: 0.92,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 6,
    },
    logoPet: {
        width: 40,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
    },
    wordmark: {
        marginTop: 16,
        fontSize: 34,
        fontWeight: "900",
        color: colors.primary,
        letterSpacing: -0.5,
    },
    tagline: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "600",
        color: colors.textPrimary,
        letterSpacing: 0.15,
        lineHeight: 22,
        paddingHorizontal: 12,
    },
    footer: {
        marginTop: 28,
        alignItems: "center",
        paddingBottom: 16,
    },
    footerAccent: {
        color: colors.primary,
        fontSize: 18,
        letterSpacing: 4,
        marginBottom: 4,
    },
    footerMuted: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1.2,
    },
});
