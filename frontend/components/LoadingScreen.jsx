import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

//Pantalla de carga
const PulseAnimation = ({ color }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                transform: [{ scale: pulseAnim }],
            }}
        >
            <MaterialCommunityIcons
                name='music'
                size={50}
                color={Colors.orange}
            />
        </Animated.View>
    );
};

const ProgressBar = ({ progress = 0.5 }) => {
    const width = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(width, {
            toValue: progress * 100,
            duration: 2000,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.ease),
        }).start();
    }, []);

    return (
        <View style={styles.progressContainer}>
            <Animated.View
                style={[
                    styles.progressFill,
                    {
                        width: width.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0%", "100%"],
                        }),
                    },
                ]}
            />
        </View>
    );
};

const LoadingScreen = ({ loadingTime }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <PulseAnimation color={Colors.orange} />
                    <Animated.View
                        style={[
                            styles.circleContainer,
                            { transform: [{ rotate: spin }] },
                        ]}
                    >
                        <View
                            style={[
                                styles.circle,
                                { backgroundColor: Colors.orange },
                            ]}
                        />
                        <View
                            style={[
                                styles.circle,
                                { backgroundColor: Colors.orange },
                            ]}
                        />
                        <View
                            style={[
                                styles.circle,
                                { backgroundColor: Colors.orange },
                            ]}
                        />
                    </Animated.View>
                </View>

                <Text style={styles.title}>Beat Finder</Text>
                <Text style={styles.subtitle}>
                    Descubriendo tu próxima canción favorita
                </Text>

                <View style={styles.loadingInfoContainer}>
                    <ProgressBar />
                    <Text style={styles.loadingText}>Cargando...</Text>
                    {loadingTime && (
                        <Text style={styles.timeText}>
                            Tiempo: {loadingTime} segundos
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
    contentContainer: {
        width: "90%",
        alignItems: "center",
        backgroundColor: "rgba(15, 15, 15, 0.7)",
        borderRadius: 16,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        width: 120,
    },
    circleContainer: {
        position: "absolute",
        height: 120,
        width: 120,
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        position: "absolute",
        backgroundColor: "#1DB954",
        width: 15,
        height: 15,
        borderRadius: 10,
        top: 5,
        opacity: 0.7,
    },
    title: {
        fontSize: 28,
        color: "#ffffff",
        fontWeight: "bold",
        marginBottom: 10,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: "#b3b3b3",
        marginBottom: 30,
        textAlign: "center",
    },
    loadingInfoContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    progressContainer: {
        height: 6,
        width: "100%",
        backgroundColor: "#333333",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 10,
    },
    progressFill: {
        height: "100%",
        backgroundColor: Colors.orange,
        borderRadius: 3,
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 16,
        marginTop: 10,
        fontWeight: "500",
    },
    timeText: {
        color: "#b3b3b3",
        fontSize: 14,
        marginTop: 5,
    },
});

export default LoadingScreen;