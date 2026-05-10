import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function ChatbotScreen() {
    const [message, setMessage] = useState('');

    const [chatLog, setChatLog] = useState([
        { id: 1, sender: 'AI', text: 'COMM-LINK ESTABLISHED. HOW CAN I ASSIST YOUR COMPANIONS TODAY?' },
        { id: 2, sender: 'PLAYER', text: 'My dog ate a weird mushroom.' },
        { id: 3, sender: 'AI', text: 'ANALYZING... WARNING: PLEASE KEEP COMPANION CALM AND BOOK A VET QUEST IMMEDIATELY.' }
    ]);

    const sendMessage = () => {
        if (message.trim() === '') return;

        const newLog = [...chatLog, { id: Date.now(), sender: 'PLAYER', text: message }];
        setChatLog(newLog);
        setMessage('');

    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            <View style={styles.headerBox}>
                <Text style={styles.header}>/// SECURE COMM-LINK ///</Text>
                <Text style={styles.status}>STATUS: ONLINE</Text>
            </View>

            <ScrollView style={styles.chatArea}>
                {chatLog.map((msg) => (
                    <View key={msg.id} style={msg.sender === 'AI' ? styles.aiMessage : styles.playerMessage}>
                        <Text style={msg.sender === 'AI' ? styles.aiText : styles.playerText}>
                            [{msg.sender}]: {msg.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputArea}>
                <Text style={styles.prompt}>></Text>
                <TextInput
                    style={styles.input}
                    placeholder="TRANSMIT MESSAGE..."
                    placeholderTextColor="#555555"
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendText}>SEND</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    headerBox: {
        borderBottomWidth: 2,
        borderBottomColor: '#00FFFF',
        padding: 15,
        backgroundColor: '#111111',
        alignItems: 'center',
    },
    header: {
        fontFamily: 'monospace',
        color: '#00FFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    status: {
        fontFamily: 'monospace',
        color: '#39FF14',
        fontSize: 12,
        marginTop: 5,
    },
    chatArea: {
        flex: 1,
        padding: 15,
    },
    aiMessage: {
        marginBottom: 15,
        paddingRight: 50,
    },
    playerMessage: {
        marginBottom: 15,
        paddingLeft: 50,
        alignItems: 'flex-end',
    },
    aiText: {
        fontFamily: 'monospace',
        color: '#00FFFF',
        fontSize: 14,
        lineHeight: 20,
    },
    playerText: {
        fontFamily: 'monospace',
        color: '#39FF14',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'right',
    },
    inputArea: {
        flexDirection: 'row',
        borderTopWidth: 2,
        borderTopColor: '#555555',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#111111',
    },
    prompt: {
        fontFamily: 'monospace',
        color: '#39FF14',
        fontSize: 18,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontFamily: 'monospace',
        color: '#FFFFFF',
        fontSize: 16,
        height: 40,
    },
    sendButton: {
        backgroundColor: '#39FF14',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginLeft: 10,
    },
    sendText: {
        fontFamily: 'monospace',
        color: '#000000',
        fontWeight: 'bold',
    }
});