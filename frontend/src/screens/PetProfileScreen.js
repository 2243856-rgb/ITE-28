import React from "react";

import {
    SafeAreaView,
    Text,
} from "react-native";

import PetCard
    from "../components/PetCard";

import globalStyles
    from "../theme/globalStyles";

export default function PetProfileScreen() {
    return (
        <SafeAreaView
            style={globalStyles.screen}
        >
            <Text style={globalStyles.title}>
                PETS
            </Text>

            <Text style={globalStyles.subtitle}>
                REGISTERED PETS
            </Text>

            <PetCard
                petName="MILO"
                breed="GOLDEN RETRIEVER"
            />

            <PetCard
                petName="LUNA"
                breed="PERSIAN CAT"
            />
        </SafeAreaView>
    );
}