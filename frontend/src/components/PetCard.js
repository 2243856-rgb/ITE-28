import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PetCard({ petName, species, level, imageUrl }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{petName}</Text>
                <Text style={styles.details}>{species} | LVL {level}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#222222',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#39FF14', // Hardcoded Neon Green
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    info: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    name: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    details: {
        color: '#AAAAAA',
        fontSize: 14,
        fontFamily: 'monospace',
    },
});
