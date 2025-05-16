import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from "../../constants/colors";

//Cabecera para la lista de playlist
const MainPlaylistHeader = ({ filteredPlaylists }) => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Playlists</Text>
            <Text style={styles.subHeaderText}>
                {filteredPlaylists.length} playlist{filteredPlaylists.length !== 1 ? "s" : ""}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 50,
    },
    headerText: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 10,
    },
    subHeaderText: {
        color: "#999",
        fontSize: 14,
        marginTop: 5,
        alignSelf: "center",
    },
});

export default MainPlaylistHeader;