import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function CustomButton({ title, onPress, color = '#39FF14' }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
            <View style={[styles.button, { borderColor: color }]}>
                <Text style={[styles.text, { color: color }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#000000',
        borderWidth: 4,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    text: {
        fontFamily: 'monospace',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});