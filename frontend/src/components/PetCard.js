import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PetCard({ petName, species, level = 1, imageUrl }) {
    return (
        <View style={styles.card}>
            {}
            <Image
                source={{ uri: imageUrl || 'https://via.placeholder.com/100/39FF14/000000?text=PET' }}
                style={styles.image}
            />

            <View style={styles.infoContainer}>
                <Text style={styles.name}>{petName}</Text>
                <Text style={styles.stats}>CLASS: {species}</Text>
                <Text style={styles.stats}>LVL  : {level}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#000000',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: '#333333',
    },
    infoContainer: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    name: {
        fontFamily: 'monospace',
        color: '#39FF14', // Neon Green
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    stats: {
        fontFamily: 'monospace',
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 2,
    },
});