import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

//Item de genero para preference
const GenreItem = ({ item, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.genreItem, isSelected && styles.genreItemSelected]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.genreText,
                    isSelected && styles.genreTextSelected,
                ]}
            >
                {item.name}
            </Text>
            {isSelected && (
                <Ionicons
                    name='checkmark-circle'
                    size={16}
                    color='#fff'
                    style={styles.genreCheckmark}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    genreItem: {
        width: "48%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    genreItemSelected: {
        backgroundColor: Colors.orange,
    },
    genreText: {
        color: Colors.white,
        fontSize: 16,
    },
    genreTextSelected: {
        fontWeight: "bold",
    },
    genreCheckmark: {
        marginLeft: 5,
    },
});

export default GenreItem;
