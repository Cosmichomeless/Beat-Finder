import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Cabecera para trofeos
const TrophyHeader = ({ permanentCount, permanentTotal, dailyCount, dailyTotal }) => {
    return (
        <View style={styles.header}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {permanentCount}/{permanentTotal}
                    </Text>
                    <Text style={styles.statLabel}>Históricos</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {dailyCount}/{dailyTotal}
                    </Text>
                    <Text style={styles.statLabel}>Diarios</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        padding: 15,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.orange,
    },
    statLabel: {
        color: "#AAA",
        marginTop: 5,
    },
});

export default TrophyHeader;