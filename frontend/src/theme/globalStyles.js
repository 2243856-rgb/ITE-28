import { StyleSheet } from "react-native";
import colors from "./colors/theme";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 8,
    },
    /** Thin gold trim — retro “accent line” */
    topAccent: {
        height: 4,
        backgroundColor: colors.gold,
    },
    headerContainer: {
        marginBottom: 22,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.textPrimary,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.textSecondary,
        letterSpacing: 1.2,
        marginTop: 6,
    },
    section: {
        marginBottom: 22,
    },
});
