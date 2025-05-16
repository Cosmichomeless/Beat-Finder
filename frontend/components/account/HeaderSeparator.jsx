import React from "react";
import { View, StyleSheet } from "react-native";


//Separador para account
export default function HeaderSeparator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    separator: {
        width: "100%",
        height: 3,
        backgroundColor: "#fff",
        marginTop: -10,
        marginBottom: 0,
    },
});
