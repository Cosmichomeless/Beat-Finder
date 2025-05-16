import React from "react";
import { View } from "react-native";
import Logo from "../../assets/Logo.svg";
import HeaderSeparator from "../account/HeaderSeparator";

//Logo de BF para auth
export default function LogoSection() {
    return (
        <View>
            <Logo width={"107%"} />
            <HeaderSeparator />
        </View>
    );
}
