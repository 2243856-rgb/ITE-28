import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentCard({ date, vetName, service }) {
    return (
        <View style={styles.card}>
            <Text style={styles.header}>QUEST: {service}</Text>
            <View style={styles.divider} />
            <Text style={styles.text}>NPC : Dr. {vetName}</Text>
            <Text style={styles.text}>TIME: {date}</Text>
            <Text style={styles.status}>[ STATUS: PENDING ]</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#000000',
        borderWidth: 4,
        borderColor: '#00FFFF', // Cyan
        padding: 15,
        marginVertical: 10,
        width: '100%',
    },
    header: {
        fontFamily: 'monospace',
        color: '#00FFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    divider: {
        height: 2,
        backgroundColor: '#00FFFF',
        marginBottom: 10,
    },
    text: {
        fontFamily: 'monospace',
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 5,
    },
    status: {
        fontFamily: 'monospace',
        color: '#FFFF00', // Yellow
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'right',
    },
});