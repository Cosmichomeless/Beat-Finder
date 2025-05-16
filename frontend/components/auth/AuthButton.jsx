import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import SpotifyLogo from "../../assets/SpotifyLogo.svg";
import { Colors } from "../../constants/colors";
import { authenticateWithSpotify } from "../../actions/authSpotify";

//Boton de autorizacion
export default function AuthButton({ router }) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => authenticateWithSpotify(router)}
        >
            <SpotifyLogo width={150} height={50} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.green,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.white,
        marginHorizontal: 50,
        marginVertical: 20,
    },
});
