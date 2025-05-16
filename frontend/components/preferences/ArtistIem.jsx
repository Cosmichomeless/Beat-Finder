import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

//Item para mostrar los artistas tras la busqueda de preferences
const ArtistItem = ({ item, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.artistItem, isSelected && styles.artistItemSelected]}
            onPress={onPress}
        >
            <Image
                source={{
                    uri:
                        item.images && item.images.length > 0
                            ? item.images[0].url
                            : "https://via.placeholder.com/50",
                }}
                style={styles.artistImage}
            />
            <Text style={styles.artistName}>{item.name}</Text>
            <View style={styles.selectIndicator}>
                {isSelected && (
                    <Ionicons
                        name='checkmark-circle'
                        size={24}
                        color={Colors.orange}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    artistItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    artistItemSelected: {
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        borderColor: Colors.orange,
        borderWidth: 1,
    },
    artistImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    artistName: {
        color: Colors.white,
        fontSize: 16,
        flex: 1,
    },
    selectIndicator: {
        width: 24,
        alignItems: "center",
    },
});

export default ArtistItem;
