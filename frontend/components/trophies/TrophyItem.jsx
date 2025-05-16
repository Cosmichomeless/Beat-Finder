import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../../constants/colors';

//Item para las listas de trofeos
const TrophyItem = ({ trophy, activeTab }) => {
    // Determina si el logro es un genero en especifico 
    const isSpecificGenre = trophy.metricType === "genres_discovered" && isNaN(parseInt(trophy.target));

    // Calculael el porcentaje de progreso 
    const progressPercentage = isSpecificGenre
        ? (trophy.unlocked ? 100 : 0)
        : Math.min((trophy.progress / trophy.target) * 100, 100);

    return (
        <TouchableOpacity
            style={[
                styles.trophyCard,
                trophy.unlocked ? styles.trophyCardUnlocked : {}
            ]}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={trophy.unlocked ? ["#FFD700", "#FFA500"] : ["#555", "#333"]}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Ionicons
                    name={trophy.icon}
                    size={30}
                    color={trophy.unlocked ? "#FFF" : "#999"}
                />
            </LinearGradient>

            <View style={styles.trophyInfo}>
                <View style={styles.trophyHeader}>
                    <Text style={styles.trophyName}>{trophy.name}</Text>
                    {trophy.unlocked && (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    )}
                </View>

                <Text style={styles.trophyDescription}>
                    {trophy.description}
                </Text>

                <View style={styles.progressContainer}>
    
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progressPercentage}%` },
                                trophy.unlocked ? styles.progressBarCompleted : {}
                            ]}
                        />
                    </View>

                    <Text style={styles.progressText}>
                        {trophy.unlocked
                            ? `Completado ${trophy.unlockedDate}`
                            : isSpecificGenre
                                ? `No descubierto`
                                : `${trophy.progress}/${trophy.target}`
                        }
                        {activeTab === "daily" && !trophy.unlocked && (
                            <Text style={styles.resetTime}> • Reinicia a las 00:00</Text>
                        )}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    trophyCard: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    trophyCardUnlocked: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    trophyInfo: {
        flex: 1,
    },
    trophyHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    trophyName: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.white,
        flexShrink: 1,
    },
    trophyDescription: {
        fontSize: 14,
        color: "#CCC",
        marginBottom: 12,
    },
    progressContainer: {
        marginTop: 4,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: Colors.orange,
        borderRadius: 3,
    },
    progressBarCompleted: {
        backgroundColor: "#4CAF50",
    },
    progressText: {
        fontSize: 12,
        color: "#AAA",
        marginTop: 6,
    },
    resetTime: {
        color: "#999",
    },
});

export default TrophyItem;