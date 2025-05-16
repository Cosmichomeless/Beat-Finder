import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Colors } from "../../../constants/colors";
import { loginUser } from "../../../actions/apiLogin";
import { useRouter } from "expo-router";
import UsernameInput from "../../../components/login/UsernameInput";
import PasswordInput from "../../../components/login/PasswordInput";
import BlackButton from "../../../components/BlackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VersionInfo from "../../../components/settings/VersionInfo";

export default function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!emailOrUsername || !password) {
            Alert.alert("Error", "Por favor, completa todos los campos.");
            return;
        }

        try {
            const responseData = await loginUser(emailOrUsername, password);
            console.log("Login exitoso");

            // Se guardan los datos del user en el dispositivo
            await AsyncStorage.setItem("userEmail", responseData.user.email);
            await AsyncStorage.setItem("user", responseData.user.username);
            await AsyncStorage.setItem("accessToken", responseData.token);
            await AsyncStorage.setItem("refreshToken", responseData.refreshToken.token);
            // Redirige a la siguiente vista si todo es correcto
            router.replace("../SpotifyAuth");
        } catch (error) {
            console.error("Error al iniciar sesión", error);
            Alert.alert("Error", "Credenciales incorrectas. Inténtalo de nuevo.");
        }
    };

    return (
        <View style={styles.container}>
            <UsernameInput
                username={emailOrUsername}
                setUsername={setEmailOrUsername}
                styles={styles}
                placeholder="Email o nombre de usuario"
            />
            <PasswordInput
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                styles={styles}
            />
            <View style={{ marginTop: 40, alignItems: "center" }}>
                <BlackButton onPress={handleLogin} text='Entrar' />
            </View>

            <VersionInfo/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        padding: 20,
    },
    title: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    gradient: {
        borderRadius: 15,
        paddingHorizontal: 10,
        borderWidth: 2,
    },
    inputext: {
        color: Colors.white,
        fontSize: 18,
        height: 50,
    },
    button: {
        width: "70%",
        borderRadius: 40,
        marginBottom: 20,
    },
    buttonGradient: {
        backgroundColor: Colors.orange,
        borderColor: Colors.black,
        borderWidth: 5,
        padding: 10,
        width: "100%",
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
    },
    buttonText: {
        color: Colors.black,
        fontSize: 20,
    },
});
