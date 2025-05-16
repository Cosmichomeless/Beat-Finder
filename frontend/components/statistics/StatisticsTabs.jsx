import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Filtros para statistics
const StatisticsTabs = ({ activeChartTab, setActiveChartTab }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeChartTab === 'bar' && styles.activeTab]}
                onPress={() => setActiveChartTab('bar')}
            >
                <Text style={[styles.tabText, activeChartTab === 'bar' && styles.activeTabText]}>
                    Barras
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeChartTab === 'pie' && styles.activeTab]}
                onPress={() => setActiveChartTab('pie')}
            >
                <Text style={[styles.tabText, activeChartTab === 'pie' && styles.activeTabText]}>
                    Circular
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeChartTab === 'calendar' && styles.activeTab]}
                onPress={() => setActiveChartTab('calendar')}
            >
                <Text style={[styles.tabText, activeChartTab === 'calendar' && styles.activeTabText]}>
                    Calendario
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeChartTab === 'radar' && styles.activeTab]}
                onPress={() => setActiveChartTab('radar')}
            >
                <Text style={[styles.tabText, activeChartTab === 'radar' && styles.activeTabText]}>
                    Balance
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: Colors.grayBg,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: Colors.orange,
    },
    tabText: {
        color: Colors.white,
        fontSize: 12,
    },
    activeTabText: {
        fontWeight: 'bold',
    },
});

export default StatisticsTabs;