import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/colors";
import { EyeIcon } from "../../constants/icons";

//Segundo campo rellenable con la contraseña
const RepeatPasswordInput = ({
    password2,
    setPassword2,
    showPassword2,
    setShowPassword2,
    styles,
}) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Repite la contraseña</Text>
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
                    secureTextEntry={!showPassword2}
                    value={password2}
                    onChangeText={setPassword2}
                />
                <TouchableOpacity
                    style={{ position: "absolute", right: 20, top: 12 }}
                    onPress={() => setShowPassword2(!showPassword2)}
                >
                    <EyeIcon showPassword={showPassword2} />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default RepeatPasswordInput;
