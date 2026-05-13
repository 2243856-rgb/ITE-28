import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import colors from "../theme/colors/theme";

export default function ChatbotScreen() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            text: "Hello — I can help with scheduling, pet care tips, and clinic questions.",
            sender: "bot",
        },
    ]);
    const [inputText, setInputText] = useState("");

    const handleSend = () => {
        if (inputText.trim().length === 0) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        setTimeout(() => {
            const botResponse = {
                id: (Date.now() + 1).toString(),
                text: "Thanks for your message. A staff member can assist with specifics in the clinic portal.",
                sender: "bot",
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 800);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={72}
            >
                <View style={styles.header}>
                    <Text style={styles.headerKicker}>ASSISTANT</Text>
                    <Text style={styles.headerTitle}>Pet care chat</Text>
                </View>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageBubble,
                                item.sender === "user"
                                    ? styles.userBubble
                                    : styles.botBubble,
                            ]}
                        >
                            <Text
                                style={
                                    item.sender === "user"
                                        ? styles.userText
                                        : styles.botText
                                }
                            >
                                {item.text}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.chatContainer}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message…"
                        placeholderTextColor={colors.textMuted}
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                        activeOpacity={0.88}
                    >
                        <Text style={styles.sendButtonText}>SEND</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 22,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surfaceElevated,
    },
    headerKicker: {
        fontSize: 11,
        fontWeight: "800",
        color: colors.gold,
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.textPrimary,
        marginTop: 4,
        letterSpacing: 0.5,
    },
    chatContainer: {
        padding: 18,
        paddingBottom: 8,
    },
    messageBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 10,
        maxWidth: "85%",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: colors.red,
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: "flex-start",
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomLeftRadius: 4,
    },
    userText: {
        color: colors.white,
        fontSize: 15,
        lineHeight: 22,
    },
    botText: {
        color: colors.textPrimary,
        fontSize: 15,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: "center",
        backgroundColor: colors.surfaceElevated,
    },
    input: {
        flex: 1,
        minHeight: 44,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginRight: 10,
        fontSize: 15,
        color: colors.textPrimary,
        backgroundColor: colors.surface,
    },
    sendButton: {
        backgroundColor: colors.gold,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        borderBottomWidth: 3,
        borderBottomColor: colors.darkRed,
    },
    sendButtonText: {
        color: colors.ink,
        fontWeight: "800",
        fontSize: 12,
        letterSpacing: 1.2,
    },
});
