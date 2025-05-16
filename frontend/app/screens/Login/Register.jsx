import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";
import { registerUser } from "../../../actions/apiLogin";
import UsernameInput from "../../../components/login/UsernameInput";
import EmailInput from "../../../components/login/EmailInput";
import PasswordInput from "../../../components/login/PasswordInput";
import RepeatPasswordInput from "../../../components/login/RepeatPasswordInput";
import BlackButton from "../../../components/BlackButton";
import { router } from "expo-router";
import VersionInfo from "../../../components/settings/VersionInfo";


export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [password2, setPassword2] = useState("");
    const [showPassword2, setShowPassword2] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        if (password !== password2) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        if (!username || !email || !password || !password2) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            const token = await registerUser(username, email, password);
            console.log("Token recibido: ", token);
            alert("Usuario registrado correctamente.");
            router.push("./Login");
        } catch (error) {
            console.error("Error al registrarse", error);
            alert("Hubo un error al registrarse.");
        }
    };

    return (
        <View style={styles.container}>
            <UsernameInput
                username={username}
                setUsername={setUsername}
                styles={styles}
            />
            <EmailInput email={email} setEmail={setEmail} styles={styles} />
            <PasswordInput
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                styles={styles}
            />
            <RepeatPasswordInput
                password2={password2}
                setPassword2={setPassword2}
                showPassword2={showPassword2}
                setShowPassword2={setShowPassword2}
                styles={styles}
            />
            <View style={{ marginTop: 40, alignItems: "center" }}>
                <BlackButton onPress={handleRegister} text='Siguiente' />
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
