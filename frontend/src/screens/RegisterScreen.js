import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>/// NEW SAVE FILE ///</Text>
                    <Text style={styles.subtitle}>INITIALIZE PLAYER DATA</Text>
                </View>

                <View style={styles.formContainer}>
                    <InputField
                        label="NEW PLAYER ID (EMAIL)"
                        placeholder="ENTER EMAIL..."
                        value={email}
                        onChangeText={setEmail}
                    />
                    <InputField
                        label="SECRET KEY (PASS)"
                        placeholder="CREATE PASSWORD..."
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <InputField
                        label="VERIFY KEY"
                        placeholder="CONFIRM PASSWORD..."
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                    />

                    <View style={{ marginTop: 30 }}>
                        <CustomButton title="CREATE CHARACTER" onPress={() => {}} color="#FF007F" />
                        <CustomButton title="< BACK TO TITLE" onPress={() => {}} color="#555555" />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scroll: {
        padding: 20,
        justifyContent: 'center',
        flexGrow: 1,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    header: {
        fontFamily: 'monospace',
        fontSize: 24,
        color: '#00FFFF', // Cyan
        fontWeight: 'bold',
    },
    subtitle: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 10,
    },
    formContainer: {
        width: '100%',
    }
});