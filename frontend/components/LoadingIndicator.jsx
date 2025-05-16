import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

//Indicador de carga
const LoadingIndicator = () => {
    return (
        <ActivityIndicator
            color={Colors.orange}
            style={styles.loadingIndicator}
        />
    );
};

const styles = StyleSheet.create({
    loadingIndicator: {
        marginTop: 20,
    },
});

export default LoadingIndicator;
