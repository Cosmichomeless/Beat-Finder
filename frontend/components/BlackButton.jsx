import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";

//Boton negro para reutilizar
export default function BlackButton({ onPress, text }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <LinearGradient
                colors={[Colors.black, Colors.orange]}
                style={styles.buttonGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.2 }}
            >
                <Text style={[styles.buttonText, { color: Colors.black }]}>
                    {text}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
        borderWidth: 3,
        borderColor: Colors.black,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
