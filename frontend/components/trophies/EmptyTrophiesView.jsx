import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

//Vista vacia para trofeos
const EmptyTrophiesView = ({ hideCompleted }) => {
    return (
        <View style={styles.emptyContainer}>
            <Ionicons name="trophy" size={60} color="#555" />
            <Text style={styles.emptyText}>
                {hideCompleted
                    ? "No hay trofeos pendientes por desbloquear"
                    : "No has completado ningún trofeo aún"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyText: {
        color: "#AAA",
        marginTop: 15,
        fontSize: 16,
    }
});

export default EmptyTrophiesView;