import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

//Cabecera de perfil settings
const ProfileHeader = ({ profileImage, username, userEmail }) => {
    return (
        <View style={styles.profileHeader}>
            {profileImage && (
                <Image
                    source={{ uri: profileImage }}
                    style={styles.headerProfileImage}
                />
            )}
            <View style={styles.profileInfo}>
                <Text style={styles.profileUsername}>@{username}</Text>
                {userEmail && <Text style={styles.profileEmail}>{userEmail}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: -10,
        paddingBottom: 30,
    },
    headerProfileImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.orange,

    },
    profileInfo: {
        marginLeft: 15,
    },
    profileUsername: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.white,
    },
    profileEmail: {
        fontSize: 14,
        color: '#AAA',
        marginTop: 2,
    },
});

export default ProfileHeader;