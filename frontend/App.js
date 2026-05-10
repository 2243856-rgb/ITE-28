import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <>
            {/* Makes the phone's clock and battery icon visible against the dark theme */}
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <AppNavigator />
        </>
    );
}