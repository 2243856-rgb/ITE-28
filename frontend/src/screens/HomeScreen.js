import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppointmentCard from '../components/AppointmentCard';
import CustomButton from '../components/CustomButton';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>/// ACTIVE QUESTS ///</Text>

                {}
                <AppointmentCard
                    service="Annual Vaccination"
                    vetName="Oak (Lvl 45)"
                    date="MAY 15, 2026 - 14:00"
                />
                <AppointmentCard
                    service="Checkup & Grooming"
                    vetName="Joy (Lvl 32)"
                    date="MAY 20, 2026 - 09:30"
                />

                <View style={styles.actionArea}>
                    <CustomButton title="+ REQUEST NEW QUEST" onPress={() => {}} color="#FF007F" />
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
        color: '#FFFF00',
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