import React from "react";
import { View, Text, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/colors";

//Campo rellenable con el email
const EmailInput = ({ email, setEmail, styles }) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Correo Electrónico</Text>
            <LinearGradient
                colors={[Colors.black, Colors.background]}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.2 }}
            >
                <TextInput
                    placeholder='Correo'
                    placeholderTextColor={"grey"}
                    style={styles.inputext}
                    value={email}
                    onChangeText={setEmail}
                />
            </LinearGradient>
        </View>
    );
};

export default EmailInput;
