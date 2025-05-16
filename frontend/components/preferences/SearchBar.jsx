import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

//Barra de busqueda de artistas en preferences
const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <View style={styles.searchBarContainer}>
            <Ionicons
                name='search'
                size={20}
                color='#999'
                style={styles.searchIcon}
            />
            <TextInput
                style={styles.searchInput}
                placeholder='Buscar artistas...'
                placeholderTextColor='#999'
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name='close-circle' size={20} color='#999' />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        height: 50,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: Colors.white,
        fontSize: 16,
    },
});

export default SearchBar;
