import * as Font from "expo-font";

export const loadFonts = () => {
    return Font.loadAsync({
        gothamBold: require("../assets/fonts/GothamBold.ttf"),
        gothamMedium: require("../assets/fonts/GothamMedium.ttf"),
    });
};
