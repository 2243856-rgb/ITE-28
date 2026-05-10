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
        paddingTop: 20,
    },

    headerContainer: {
        marginBottom: 26,
    },

    title: {
        fontSize: 30,
        fontWeight: "900",

        color: colors.black,

        letterSpacing: 2,
    },

    subtitle: {
        marginTop: 6,

        fontSize: 13,

        color: colors.darkRed,

        fontWeight: "800",

        letterSpacing: 1,
    },

    section: {
        backgroundColor: colors.white,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 12,

        padding: 18,

        marginBottom: 18,
    },

    topAccent: {
        height: 14,

        backgroundColor: colors.red,

        borderBottomWidth: 3,
        borderBottomColor: colors.black,
    },
});