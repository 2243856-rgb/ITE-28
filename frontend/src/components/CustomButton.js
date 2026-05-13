import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Removed the broken colors import
export default function CustomButton({ title, onPress, color }) {
    return (
        <TouchableOpacity 
            style={[styles.button, { backgroundColor: color || '#007BFF' }]} 
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
});
