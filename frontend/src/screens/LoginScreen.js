import React, { useState } from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
} from "react-native";

import InputField from "../components/InputField";

import CustomButton from "../components/CustomButton";

import globalStyles from "../theme/globalStyles";

import colors from "../theme/colors/theme";

import { loginUser } from "../services/auth.service";

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
                    <View style={styles.brandBlock}>
                        <Image
                            source={require("../../assets/images/nestvet-logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityLabel="NestVet logo"
                        />
                        <Text style={styles.tagline}>
                            the future of vet care, delivered to you
                        </Text>
                    </View>

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
        marginTop: 4,
    },
    logo: {
        width: 260,
        height: 200,
        maxWidth: "100%",
    },
    tagline: {
        marginTop: 12,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "600",
        color: colors.textPrimary,
        letterSpacing: 0.2,
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
