import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/colors";
import { EyeIcon } from "../../constants/icons";

//Campo rellenable con la contraseña
const PasswordInput = ({
    password,
    setPassword,
    showPassword,
    setShowPassword,
    styles,
}) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Contraseña</Text>
            <LinearGradient
                colors={[Colors.black, Colors.background]}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.2 }}
            >
                <TextInput
                    placeholder='Contraseña'
                    placeholderTextColor={"grey"}
                    style={styles.inputext}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={{ position: "absolute", right: 20, top: 12 }}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <EyeIcon showPassword={showPassword} />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default PasswordInput;
