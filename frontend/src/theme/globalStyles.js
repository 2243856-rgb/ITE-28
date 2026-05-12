import { StyleSheet } from "react-native";

// We removed the colors import because the file doesn't exist.
// Hardcoded hex codes are used instead.

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    topAccent: {
        height: 5,
        backgroundColor: "#007BFF",
    },
    headerContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000000",
    },
    subtitle: {
        fontSize: 18,
        color: "#666666",
    },
    section: {
        marginBottom: 20,
    },
});
