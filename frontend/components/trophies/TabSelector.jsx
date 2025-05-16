import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Filtro entre torfeos diarios e historicos
const TabSelector = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[
                    styles.tabButton,
                    activeTab === "permanent" && styles.activeTabButton
                ]}
                onPress={() => onTabChange("permanent")}
            >
                <Text style={[
                    styles.tabText,
                    activeTab === "permanent" && styles.activeTabText
                ]}>
                    Históricos
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.tabButton,
                    activeTab === "daily" && styles.activeTabButton
                ]}
                onPress={() => onTabChange("daily")}
            >
                <Text style={[
                    styles.tabText,
                    activeTab === "daily" && styles.activeTabText
                ]}>
                    Diarios
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTabButton: {
        borderBottomColor: Colors.orange,
    },
    tabText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#AAA",
    },
    activeTabText: {
        color: Colors.white,
        fontWeight: "600",
    },
});

export default TabSelector;