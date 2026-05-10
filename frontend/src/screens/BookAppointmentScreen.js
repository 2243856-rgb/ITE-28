import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

export default function BookAppointmentScreen() {
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>/// QUEST BOARD ///</Text>

                <View style={styles.board}>
                    <Text style={styles.warning}>! WARNING: Ensure your party is ready for the Vet encounter.</Text>

                    <InputField
                        label="QUEST TYPE (SERVICE)"
                        placeholder="e.g., Checkup, Vaccine..."
                        value={service}
                        onChangeText={setService}
                    />
                    <InputField
                        label="TIME CYCLE (DATE)"
                        placeholder="YYYY-MM-DD"
                        value={date}
                        onChangeText={setDate}
                    />
                    <InputField
                        label="SPAWN POINT (ADDRESS)"
                        placeholder="Enter home address..."
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                <View style={styles.actionArea}>
                    <CustomButton title="ACCEPT QUEST" onPress={() => {}} color="#39FF14" />
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
        color: '#FF007F', // Neon Pink
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 2,
    },
    board: {
        backgroundColor: '#000000',
        borderWidth: 2,
        borderColor: '#555555',
        padding: 15,
    },
    warning: {
        fontFamily: 'monospace',
        color: '#FFFF00', // Yellow
        fontSize: 12,
        marginBottom: 20,
    },
    actionArea: {
        marginTop: 30,
    }
});