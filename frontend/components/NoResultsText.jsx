import React from "react";
import { Text, StyleSheet } from "react-native";

//Vista en caso de que no haya resultados
const NoResultsText = ({ text }) => {
    return <Text style={styles.noResultsText}>{text}</Text>;
};

const styles = StyleSheet.create({
    noResultsText: {
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
});

export default NoResultsText;
