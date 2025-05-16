import React from "react";
import { View, StyleSheet } from "react-native";

//Separador unicamente visual 
export default function Separator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: "#fff",
        marginTop: 0,
        marginBottom: 10,
    },
});
