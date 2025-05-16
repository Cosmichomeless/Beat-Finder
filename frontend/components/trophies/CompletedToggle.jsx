import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../../constants/colors';

//Boton para mostrar logros completados
const CompletedToggle = ({ hideCompleted, onToggle }) => {
    return (
        <TouchableOpacity
            style={styles.completedToggleButton}
            onPress={onToggle}
        >
            <View style={styles.completedToggleContent}>
                <Ionicons
                    name={hideCompleted ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={Colors.white}
                    style={styles.completedToggleIcon}
                />
                <Text style={styles.completedToggleText}>
                    {hideCompleted
                        ? "Mostrar solo logros completados"
                        : "Mostrar logros pendientes"}
                </Text>
            </View>

            <View style={[
                styles.completedToggleIndicator,
                hideCompleted ? styles.completedToggleIndicatorHidden : styles.completedToggleIndicatorVisible
            ]}>
                <Ionicons
                    name={hideCompleted ? "chevron-down" : "chevron-up"}
                    size={16}
                    color={hideCompleted ? "#AAA" : Colors.orange}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    completedToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 20,
        marginVertical: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    completedToggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedToggleIcon: {
        marginRight: 10,
    },
    completedToggleText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    completedToggleIndicator: {
        padding: 4,
        borderRadius: 12,
    },
    completedToggleIndicatorVisible: {
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
    },
    completedToggleIndicatorHidden: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default CompletedToggle;