import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';

import { View, Text } from 'react-native';
const DummyAuthScreen = () => (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#39FF14', fontFamily: 'monospace', fontSize: 24 }}>PRESS START TO LOGIN</Text>
    </View>
);

const Stack = createStackNavigator();

export default function AppNavigator() {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true to see the main menu for now!

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="MainApp" component={BottomTabNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={DummyAuthScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}