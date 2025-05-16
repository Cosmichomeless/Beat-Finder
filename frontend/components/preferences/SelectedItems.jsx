import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

//Mostrar los items seleccionados
const SelectedItems = ({ items, onItemPress, title }) => {
    return (
        <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>{title}</Text>
            <View style={styles.chipsContainer}>
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.chip}
                        onPress={() => onItemPress(item)}
                    >
                        <Text style={styles.chipText}>{item.name}</Text>
                        <Ionicons name='close-circle' size={16} color='#fff' />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    selectedContainer: {
        marginBottom: 20,
    },
    selectedTitle: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 10,
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip: {
        backgroundColor: Colors.orange,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: Colors.white,
        marginRight: 5,
    },
});

export default SelectedItems;
