import React from "react";
import { View, StyleSheet } from "react-native";

import { useRouter } from "expo-router";

import { Colors } from "../../constants/colors";
import LogoSection from "../../components/auth/LogoSection";
import DescriptionText from "../../components/auth/DescriptionText";
import AuthButton from "../../components/auth/AuthButton";

export default function SpotifyAuth() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LogoSection />
            <DescriptionText />
            <AuthButton router={router} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
});
