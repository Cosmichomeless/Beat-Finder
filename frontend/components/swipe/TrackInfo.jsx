import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Informacion de recomendacion PlaylistRecommendations
const TrackInfo = ({ track }) => {
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.infoTag}>
                Recomendado por: {track.mainArtist || track.genre}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
    },
    infoTag: {
        color: Colors.white,
        opacity: 0.8,
        fontSize: 14,
        marginHorizontal: 5,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginBottom: 5,
    },
});

export default TrackInfo;