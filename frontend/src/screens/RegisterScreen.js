import React from "react";

import {
    SafeAreaView,
    Text,
} from "react-native";

import InputField
    from "../components/InputField";

import CustomButton
    from "../components/CustomButton";

import globalStyles
    from "../theme/globalStyles";

export default function RegisterScreen({
                                           navigation,
                                       }) {
    return (
        <SafeAreaView
            style={globalStyles.screen}
        >
            <Text style={globalStyles.title}>
                REGISTER
            </Text>

            <Text style={globalStyles.subtitle}>
                CREATE ACCOUNT
            </Text>

            <InputField placeholder="NAME" />

            <InputField placeholder="EMAIL" />

            <InputField
                placeholder="PASSWORD"
                secureTextEntry
            />

            <CustomButton
                title="CREATE ACCOUNT"
                onPress={() =>
                    navigation.navigate("Login")
                }
            />
        </SafeAreaView>
    );
}