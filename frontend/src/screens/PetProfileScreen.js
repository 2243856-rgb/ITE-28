import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PetCard from '../components/PetCard';
import CustomButton from '../components/CustomButton';

export default function PetProfileScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>/// YOUR PARTY ///</Text>

                {/* Hardcoded pets */}
                <PetCard
                    petName="DOGE"
                    species="Shiba Inu"
                    level={5}
                    imageUrl="https://via.placeholder.com/100/39FF14/000000?text=DOG"
                />
                <PetCard
                    petName="NYAN"
                    species="Space Cat"
                    level={99}
                    imageUrl="https://via.placeholder.com/100/FF007F/000000?text=CAT"
                />

                <View style={styles.actionArea}>
                    <CustomButton title="+ SUMMON NEW PET" onPress={() => {}} color="#00FFFF" />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
    },
    scroll: {
        padding: 20,
    },
    header: {
        fontFamily: 'monospace',
        color: '#39FF14',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 2,
    },
    actionArea: {
        marginTop: 30,
    }
});