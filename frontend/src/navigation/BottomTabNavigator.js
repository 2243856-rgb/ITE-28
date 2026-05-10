import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';

const DummyScreen = ({ name }) => (
    <View style={styles.dummyContainer}>
        <Text style={styles.dummyText}>[ {name} SCREEN ]</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#39FF14',
                tabBarInactiveTintColor: '#555555',
                tabBarIcon: ({ color }) => {
                    let icon;
                    if (route.name === 'Quests') icon = '📜';
                    else if (route.name === 'Companions') icon = '🐾';
                    else if (route.name === 'Comm-Link') icon = '🤖';
                    else if (route.name === 'System') icon = '⚙️';

                    return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
                },
                tabBarLabelStyle: styles.tabLabel,
            })}
        >
            <Tab.Screen name="Quests" children={() => <DummyScreen name="QUESTS" />} />
            <Tab.Screen name="Companions" children={() => <DummyScreen name="COMPANIONS" />} />
            <Tab.Screen name="Comm-Link" children={() => <DummyScreen name="AI COMM-LINK" />} />
            <Tab.Screen name="System" children={() => <DummyScreen name="SYSTEM" />} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#000000',
        borderTopWidth: 4,
        borderTopColor: '#FF007F',
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
    },
    tabLabel: {
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    header: {
        backgroundColor: '#000000',
        borderBottomWidth: 4,
        borderBottomColor: '#00FFFF',
        shadowColor: 'transparent',
        elevation: 0,
    },
    headerTitle: {
        fontFamily: 'monospace',
        color: '#00FFFF',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    dummyContainer: {
        flex: 1,
        backgroundColor: '#111111',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dummyText: {
        fontFamily: 'monospace',
        color: '#FFFFFF',
        fontSize: 24,
    }
});