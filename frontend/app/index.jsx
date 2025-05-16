import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "../constants/colors";
import { loadFonts } from "../constants/fonts";
import BlackButton from "../components/BlackButton";
import OrangeButton from "../components/OrangeButton";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// Importación del SVG
import Logo from "../assets/Logo.svg";

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadAppFonts = async () => {
            await loadFonts();
            setFontsLoaded(true);
        };

        loadAppFonts();
    }, []);

    if (!fontsLoaded) {
        return <ActivityIndicator size='large' color='#000' />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Uso correcto del componente SVG con propiedades específicas */}
                <Logo width={'109%'} />
            </View>
            <View style={styles.buttonsContainer}>
                <BlackButton
                    onPress={() => router.push("./screens/Login/Login")}
                    text='Iniciar Sesion'
                />
                <OrangeButton
                    onPress={() => router.push("./screens/Login/Register")}
                    text='Registrarse'
                />
            </View>
            <StatusBar style='auto' />
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
});