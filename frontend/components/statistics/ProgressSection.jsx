import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const WIDTH = Dimensions.get('window').width;

//Seccion de progresion para statistics
const ProgressItem = ({ title, current, target, color }) => {
    return (
        <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>{title}</Text>
                <Text style={styles.progressValue}>
                    {current}/{target}
                </Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View
                    style={[styles.progressBar, {
                        width: `${Math.min(100, (current / target) * 100)}%`,
                        backgroundColor: color
                    }]}
                />
            </View>
        </View>
    );
};

const ProgressSection = ({ progressData }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                style={styles.header}
            >
                <Text style={styles.sectionTitle}>Progreso hacia metas</Text>
            </LinearGradient>

            <View style={styles.content}>
                {progressData.map((progress, index) => (
                    <ProgressItem
                        key={index}
                        title={progress.title}
                        current={progress.current}
                        target={progress.target}
                        color={progress.color}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: WIDTH * 0.9,
        marginVertical: 15,
        backgroundColor: Colors.grayBg,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    content: {
        padding: 15,
        backgroundColor: Colors.darkGray,
    },
    progressItem: {
        marginBottom: 15,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    progressTitle: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressValue: {
        color: Colors.orange,
        fontSize: 14,
    },
    progressBarContainer: {
        height: 8,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
});

export default ProgressSection;