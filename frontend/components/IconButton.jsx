import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

//Boton reutilizable con diferentes iconos
const IconButton = ({ onPress, IconComponent, iconProps }) => {
    return (
        <View style={styles.icon}>
            <TouchableOpacity onPress={onPress}>
                <IconComponent {...iconProps} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        backgroundColor: "rgba(0, 0, 0, 0.25)", 
        padding: 20,
        borderRadius: 50,
    },
});

export default IconButton;
