import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from "react-native-animatable";

// Mensaje en caso de que no haya mas canciones playlistRecommendations
const NoMoreTracks = () => {
    return (
        <Animatable.View animation="flipInY" style={styles.container}>
            <Text style={styles.text}>
                No hay más canciones para mostrar
            </Text>
            <Text style={styles.subText}>
                Redirigiendo a la página principal...
            </Text>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50
    },
    text: {
        color: "#ffffff",
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
    },
    subText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        opacity: 0.7
    },
});

export default NoMoreTracks;