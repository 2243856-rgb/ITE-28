import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    StyleSheet,
} from "react-native";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import globalStyles from "../theme/globalStyles";
import colors from "../theme/colors/theme";
import { useAuth } from "../context/AuthContext";
import { showAlert } from "../utils/showAlert";

export default function RegisterScreen({ navigation }) {
    const { register, error: authError, clearError } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        clearError();
    }, [clearError]);

    const submit = async () => {
        const name = fullName.trim();
        const em = email.trim().toLowerCase();
        if (!name || !em || !password) {
            showAlert(
                "Create account",
                "Name, email, and password are required."
            );
            return;
        }
        if (password.length < 8) {
            showAlert(
                "Create account",
                "Password must be at least 8 characters (server rule)."
            );
            return;
        }
        const res = await register({
            fullName: name,
            email: em,
            password,
            phoneNumber: phone.trim() || undefined,
        });
        if (!res.ok) {
            const title =
                res.phase === "login"
                    ? "Sign-in after register"
                    : "Registration failed";
            showAlert(title, res.message || "Try again.");
        }
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={globalStyles.topAccent} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={globalStyles.container}>
                    <View style={globalStyles.headerContainer}>
                        <Text style={globalStyles.title}>Create account</Text>
                        <Text style={globalStyles.subtitle}>
                            Pet owners use this form to join NestVet.
                        </Text>
                    </View>

                    {authError ? (
                        <Text style={styles.inlineErr}>{authError}</Text>
                    ) : null}

                    <View style={globalStyles.section}>
                        <InputField
                            label="FULL NAME"
                            placeholder="Your name"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <InputField
                            label="EMAIL"
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                        <InputField
                            label="PHONE (OPTIONAL)"
                            placeholder="+63…"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <InputField
                            label="PASSWORD (8+ CHARACTERS)"
                            placeholder="Choose a strong password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <CustomButton
                        title="CREATE ACCOUNT"
                        onPress={() => {
                            void submit();
                        }}
                    />
                    <CustomButton
                        title="BACK TO SIGN IN"
                        variant="secondary"
                        onPress={() => navigation.navigate("Login")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    inlineErr: {
        color: colors.darkRed,
        textAlign: "center",
        marginBottom: 8,
        fontWeight: "700",
    },
});
