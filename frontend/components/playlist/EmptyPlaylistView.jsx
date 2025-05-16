import React from "react";
import { Text, StyleSheet } from "react-native";

//Vista para playlist que esten vacias
const EmptyPlaylistView = () => (
    <Text style={styles.noTracksText}>
        No hay canciones en esta playlist
    </Text>
);

const styles = StyleSheet.create({
    noTracksText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
    },
});

export default EmptyPlaylistView;