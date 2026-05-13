import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity
} from "react-native";

// Removed globalStyles and colors imports as they cause resolve errors
export default function ChatbotScreen() {
    const [messages, setMessages] = useState([
        { id: "1", text: "Hello! How can I help you and your pet today?", sender: "bot" }
    ]);
    const [inputText, setInputText] = useState("");

    const handleSend = () => {
        if (inputText.trim().length === 0) return;

        const userMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        setTimeout(() => {
            const botResponse = {
                id: (Date.now() + 1).toString(),
                text: "I'm here to help with your pet questions!",
                sender: "bot"
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PET ASSISTANT</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.sender === "user" ? styles.userBubble : styles.botBubble
                    ]}>
                        <Text style={item.sender === "user" ? styles.userText : styles.botText}>
                            {item.text}
                        </Text>
                    </View>
                )}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask something..."
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>SEND</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007BFF",
    },
    chatContainer: {
        padding: 15,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        maxWidth: "80%",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#007BFF",
    },
    botBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#F0F0F0",
    },
    userText: {
        color: "#FFFFFF",
    },
    botText: {
        color: "#333333",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        alignItems: "center",
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});
