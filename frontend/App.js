import React from "react";
import { StatusBar } from "react-native";

import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import colors from "./src/theme/colors/theme";

export default function App() {
    return (
        <AuthProvider>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />
            <RootNavigator />
        </AuthProvider>
    );
}
