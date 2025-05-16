import React from "react";
import { Text, StyleSheet } from "react-native";
import MiniSpotifyLogo from "../../assets/MiniSpotifyLogo.svg";
import DeezerIcon from "../../assets/deezerIcon.svg";
import { Colors } from "../../constants/colors";

//Texto explicativo para auth
export default function DescriptionText() {
    return (
        <Text style={styles.text}>
            Beat Finder no cuenta con una biblioteca propia, por lo que está
            asociada a Spotify <MiniSpotifyLogo width={20} height={20} /> y
            Deezer <DeezerIcon width={20} height={20} /> para ofrecerte
            recomendaciones personalizadas. Para continuar, inicia sesión con tu
            cuenta de Spotify.
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        color: Colors.white,
        fontSize: 18,
        textAlign: "center",
        marginVertical: 20,
        marginHorizontal: 20,
    },
});
