import React from 'react';
import { FlatList, Text, RefreshControl, StyleSheet } from 'react-native';
import { Colors } from "../../constants/colors";
import PlaylistItem from './PlaylistItem';

//Lista de playlists
const PlaylistList = ({ filteredPlaylists, refreshing, onRefresh }) => {
    return (
        <FlatList
            data={filteredPlaylists}
            renderItem={({ item }) => <PlaylistItem item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.orange}
                    colors={[Colors.orange]}
                />
            }
            ListEmptyComponent={() => (
                <Text style={styles.noPlaylistsText}>
                    {showOnlyMine ? "No tienes playlists propias" : "No se encontraron playlists"}
                </Text>
            )}
        />
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        padding: 12,
        marginTop: -10,
    },
    noPlaylistsText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
    },
});

export default PlaylistList;