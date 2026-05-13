import React, { useState } from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

import InputField from "../components/InputField";

import CustomButton from "../components/CustomButton";

import globalStyles from "../theme/globalStyles";

import colors from "../theme/colors/theme";

import { useAuth } from "../context/AuthContext";
import { showAlert } from "../utils/showAlert";

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
    const { login, error: authError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !password) {
            showAlert("Sign in", "Enter email and password.");
            return;
        }
        const res = await login(trimmedEmail, password);
        if (!res.ok) {
            showAlert("Sign in failed", res.message || "Try again.");
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

                    {authError ? (
                        <Text style={styles.inlineErr}>{authError}</Text>
                    ) : null}

                    <Text style={styles.signInTitle}>Sign in</Text>

                    <View style={globalStyles.section}>
                        <InputField
                            label="EMAIL"
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />

                        <InputField
                            label="PASSWORD"
                            placeholder="Your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <CustomButton title="SIGN IN" onPress={handleLogin} />

                        <CustomButton
                            title="CREATE ACCOUNT"
                            variant="secondary"
                            onPress={() => navigation.navigate("Register")}
                        />
                    </View>

                    <View style={styles.hintBox}>
                        <Text style={styles.hintTitle}>Demo accounts</Text>
                        <Text style={styles.hintBody}>
                            Pet parent — demo@nestvet.app / password123{"\n"}
                            Admin console — admin@nestvet.app / admin123
                        </Text>
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
    inlineErr: {
        color: colors.darkRed,
        textAlign: "center",
        marginBottom: 8,
        fontWeight: "700",
    },
    signInTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: colors.textPrimary,
        letterSpacing: 1,
        marginBottom: 4,
    },
    hintBox: {
        marginTop: 8,
        padding: 14,
        borderRadius: 12,
        backgroundColor: colors.surfaceGoldTint,
        borderWidth: 1,
        borderColor: colors.border,
    },
    hintTitle: {
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: 6,
        fontSize: 13,
    },
    hintBody: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
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
