import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const WIDTH = Dimensions.get('window').width;

//Seccion de trofeos recientes para statistics
const RecentAchievements = ({ achievements }) => {
    return (
        <View style={styles.container}>

            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                style={styles.header}
            >
                <Text style={styles.sectionTitle}>Logros recientes</Text>
            </LinearGradient>

            <View style={styles.content}>
                {achievements.map((achievement, index) => (
                    <View
                        key={index}
                        style={[
                            styles.achievementItem,
                            index === achievements.length - 1 && styles.lastAchievementItem
                        ]}
                    >
                        <View style={[styles.achievementIconContainer, { backgroundColor: achievement.color }]}>
                            <Ionicons name={achievement.icon} size={24} color="white" />
                        </View>
                        <View style={styles.achievementInfo}>
                            <Text style={styles.achievementTitle}>{achievement.name}</Text>
                            <Text style={styles.achievementDescription}>{achievement.description}</Text>
                        </View>
                        <Text style={styles.achievementDate}>{achievement.date}</Text>
                    </View>
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
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    lastAchievementItem: {
        borderBottomWidth: 0,
    },
    achievementIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    achievementDescription: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
    achievementDate: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
    }
});

export default RecentAchievements;