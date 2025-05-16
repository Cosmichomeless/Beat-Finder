import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

//Componente para la lista de canciones en historial 
const HistoryItem = ({
    item,
    swipeableRef,
    playSound,
    addTrackToBeatFinderPlaylist,
    isCurrentTrack,
    isPlaying,
    loadingAudio
}) => {
    // Renderizar las acciones de deslizamiento a la izquierda (añadir a playlist)
    const renderLeftActions = () => (
        <View style={styles.leftActions}>
            <TouchableOpacity
                style={styles.addAction}
                onPress={async () => {
                    // Se pasa la referencia del elemento
                    const success = await addTrackToBeatFinderPlaylist(item, swipeableRef);
                    if (!success) {
                        if (swipeableRef && swipeableRef.current) {
                            swipeableRef.current.close();
                        }
                    }
                }}
            >
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.actionText}>Añadir a Beat Finder</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            friction={2}
            leftThreshold={80}
        >
            <View style={styles.itemContainer}>
             
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={[
                            styles.image,
                            isCurrentTrack && isPlaying && styles.playingImage
                        ]}
                    />
  
                    <TouchableOpacity
                        style={styles.playIconOverlay}
                        onPress={() => playSound(item.preview)}
                    >
                        {loadingAudio && isCurrentTrack ? (
                            <ActivityIndicator size="small" color={Colors.orange} />
                        ) : (
                            <Ionicons
                                name={isCurrentTrack && isPlaying ? "pause" : "play"}
                                size={24}
                                color="white"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.album} numberOfLines={1}>{item.album}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
                    <View style={styles.decisionContainer}>
                        <Text style={[
                            styles.decision,
                            item.decision === "Yup" ? styles.savedDecision : styles.notSavedDecision
                        ]}>
                            {item.decision === "Yup" ? "Guardada" : "No guardada"}
                        </Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    );
};


const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: Colors.black,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    imageContainer: {
        position: "relative",
        width: 75,
        height: 75,
        marginRight: 15,
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 10,
    },
    playingImage: {
        borderWidth: 2,
        borderColor: Colors.orange,
        opacity: 0.8,
    },
    playIconOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
    },
    artist: {
        fontSize: 14,
        color: "#999",
        marginBottom: 2,
    },
    album: {
        fontSize: 14,
        color: "#999",
        marginBottom: 2,
    },
    decisionContainer: {
        flexDirection: 'row',
    },
    decision: {
        fontSize: 12,
        fontWeight: '500',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    savedDecision: {
        backgroundColor: 'rgba(56, 142, 60, 0.2)',
        color: '#66BB6A',
    },
    notSavedDecision: {
        backgroundColor: 'rgba(229, 57, 53, 0.2)',
        color: '#EF5350',
    },
    leftActions: {
        backgroundColor: "#388E3C", 
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        height: "100%",
    },
    addAction: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    actionText: {
        color: "white",
        fontWeight: "500",
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
    },
});

export default HistoryItem;