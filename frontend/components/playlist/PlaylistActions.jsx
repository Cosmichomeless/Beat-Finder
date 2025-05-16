import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

//Menu para filtrar playlist
const PlaylistActions = ({ showOnlyMine, setShowOnlyMine, handleCreatePlaylist, creatingPlaylist }) => {
    return (
        <View style={styles.actionsContainer}>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, !showOnlyMine && styles.filterButtonActive]}
                    onPress={() => setShowOnlyMine(false)}
                >
                    <Text style={[styles.filterButtonText, !showOnlyMine && styles.filterButtonTextActive]}>
                        Todas
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, showOnlyMine && styles.filterButtonActive]}
                    onPress={() => setShowOnlyMine(true)}
                >
                    <Text style={[styles.filterButtonText, showOnlyMine && styles.filterButtonTextActive]}>
                        Mis Playlists
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreatePlaylist}
                disabled={creatingPlaylist}
            >
                {creatingPlaylist ? (
                    <ActivityIndicator size='small' color={Colors.black} />
                ) : (
                    <>
                        <Ionicons name='add' size={18} color={Colors.black} />
                        <Text style={styles.createButtonText}>Nueva Playlist</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionsContainer: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 12,
        alignSelf: "center",
    },
    createButton: {
        backgroundColor: Colors.orange,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    createButtonText: {
        color: Colors.black,
        fontWeight: "bold",
        marginLeft: 5,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    filterButtonActive: {
        backgroundColor: Colors.orange,
        borderColor: Colors.orange,
    },
    filterButtonText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
    },
    filterButtonTextActive: {
        color: Colors.black,
        fontWeight: "bold",
    },
});

export default PlaylistActions;