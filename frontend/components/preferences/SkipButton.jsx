import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/colors";

//Boton para saltar las preferences
const SkipButton = ({ onPress, loading }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={loading}
        >
            <LinearGradient
                colors={[Colors.black, Colors.gray]}
                style={styles.buttonGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.2 }}
            >
                <Text style={[styles.buttonText, { color: Colors.white }]}>
                    Omitir este paso
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "70%",
        borderRadius: 40,
        marginBottom: 20,
    },
    buttonGradient: {
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

export default SkipButton;