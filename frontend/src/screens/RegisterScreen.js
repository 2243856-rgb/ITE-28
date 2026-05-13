import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
} from "react-native";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import globalStyles from "../theme/globalStyles";

export default function RegisterScreen({ navigation }) {
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
                        <Text style={globalStyles.title}>REGISTER</Text>
                        <Text style={globalStyles.subtitle}>
                            Create your clinic account
                        </Text>
                    </View>

                    <View style={globalStyles.section}>
                        <InputField placeholder="FULL NAME" />
                        <InputField placeholder="EMAIL" />
                        <InputField
                            placeholder="PASSWORD"
                            secureTextEntry
                        />
                    </View>

                    <CustomButton
                        title="CREATE ACCOUNT"
                        onPress={() => navigation.navigate("Login")}
                    />
                    <CustomButton
                        title="BACK TO LOGIN"
                        variant="secondary"
                        onPress={() => navigation.navigate("Login")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
