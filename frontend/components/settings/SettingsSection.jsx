import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../../constants/colors';

//Componente para las distintas secciones de settings
const SettingsSection = ({ title, options }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.card}>
                {options.map((option, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            style={styles.cardOption}
                            onPress={option.onPress}
                        >
                            <View style={styles.optionContent}>
                                <Ionicons
                                    name={option.icon}
                                    size={22}
                                    color={option.iconColor}
                                    style={styles.optionIcon}
                                />
                                <Text style={[styles.optionText, option.textStyle]}>
                                    {option.text}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#AAA" />
                        </TouchableOpacity>

                        {index < options.length - 1 && <View style={styles.separator} />}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#AAA',
        marginBottom: 10,
        paddingLeft: 5,
    },
    card: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginHorizontal: 15,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 14,
    },
    optionText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
    },
});

export default SettingsSection;