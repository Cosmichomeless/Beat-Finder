import React from "react";
import { View, Text, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/colors";

//Campo rellenable con el nombre de usuario 
const UsernameInput = ({ username, setUsername, styles }) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Nombre Usuario</Text>
            <LinearGradient
                colors={[Colors.black, Colors.background]}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.2 }}
            >
                <TextInput
                    placeholder='Usuario'
                    placeholderTextColor={"grey"}
                    style={styles.inputext}
                    value={username}
                    onChangeText={setUsername}
                />
            </LinearGradient>
        </View>
    );
};

export default UsernameInput;
