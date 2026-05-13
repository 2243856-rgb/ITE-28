/**
 * NestVet brand palette — cream field, vibrant orange wordmark, black type
 * (aligned with NestVet logo: Corgi + nest on warm cream).
 */
const primary = "#E8782E";
const primaryDark = "#C86220";
const nestBrown = "#4A3628";

export default {
    primary,
    primaryDark,
    nestBrown,

    /** Legacy keys — mapped so existing screens keep working */
    red: primary,
    darkRed: nestBrown,
    gold: primary,
    goldMuted: "#F0C9A0",

    ink: "#1A1A1A",
    black: "#1A1A1A",
    white: "#FFFFFF",

    background: "#FAF6F0",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    surfaceGoldTint: "#FFF4EC",

    textPrimary: "#1A1A1A",
    textSecondary: "#4A4540",
    textMuted: "#7A746C",

    border: "#E8E2D8",
    borderStrong: "#D4CDC2",

    chrome: "#1A1A1A",
    chromeBorder: primary,
};
