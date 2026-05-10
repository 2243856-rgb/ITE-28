import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log("Player logging in...", email);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>NESTVET</Text>
                <Text style={styles.subtitle}>PRESS START TO BEGIN</Text>
            </View>

            <View style={styles.formContainer}>
                <InputField
                    label="PLAYER ID (EMAIL)"
                    placeholder="ENTER EMAIL..."
                    value={email}
                    onChangeText={setEmail}
                />
                <InputField
                    label="SECRET KEY (PASS)"
                    placeholder="ENTER PASSWORD..."
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                <View style={{ marginTop: 20 }}>
                    <CustomButton title="START GAME" onPress={handleLogin} color="#39FF14" />
                    <CustomButton title="CREATE SAVE FILE" onPress={() => {}} color="#00FFFF" />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 20,
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontFamily: 'monospace',
        fontSize: 48,
        color: '#FF007F', // Neon Pink
        fontWeight: 'bold',
        textShadowColor: '#FFFFFF',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    subtitle: {
        fontFamily: 'monospace',
        fontSize: 16,
        color: '#FFFF00', // Yellow
        marginTop: 10,
        animation: 'blink 1s infinite',
    },
    formContainer: {
        width: '100%',
    }
});