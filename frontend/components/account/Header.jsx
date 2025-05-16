import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Logo from "../../assets/Logo.svg";
import { Colors } from "../../constants/colors";

//Cabecera para perfil 
const Header = ({ profile }) => {
    return (
        <View style={styles.header}>
            <View style={styles.logoWrapper}>

                <Logo width={"100%"} style={styles.logo} />

                <View style={styles.separator} />
            </View>

            {profile && (
                <View style={styles.profileSection}>
                    {profile.images && profile.images.length > 0 && (
                        <Image
                            source={{ uri: profile.images[0].url }}
                            style={styles.profileImage}
                        />
                    )}
                </View>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1C1C1C",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    logoWrapper: {
        position: "relative",
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    logo: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    profileSection: {
        position: "absolute",
        bottom: -70,
        alignItems: "center",
        justifyContent: "center",
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: Colors.white,
    },
    separator: {
        width: "100%",
        height: 3,
        backgroundColor: Colors.white,
        position: "absolute",
        bottom: 0,
    },

});

export default Header;
