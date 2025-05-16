import React from "react";
import { Text, StyleSheet } from "react-native";


//Estadisticas de carga de canciones
const StatsFooter = ({ loadingTime, totalTracks }) => (
    <>
        <Text style={styles.text}>Tiempo de carga: {loadingTime} segundos</Text>
        <Text style={styles.text}>
            Total de canciones encontradas: {totalTracks}
        </Text>
    </>
);

const styles = StyleSheet.create({
    text: {
        color: "#ffffff",
        fontSize: 16,
        marginBottom: 2,
    },
});

export default StatsFooter;
