import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Recomendations from "./recomendations";
import Account from "./account";
import Playlist from "./playlist";
import { Colors } from "../../../constants/colors";
import {
    PlaylistIcon,
    RecommendationsIcon,
    AccountIcon,
} from "../../../constants/icons";

const Tab = createBottomTabNavigator();

export default function Layout() {
    const [backgroundColor, setBackgroundColor] = useState(
        Colors.defaultBackground
    );

    const handleFocus = (routeName) => {
        switch (routeName) {
            case "Playlist":
                setBackgroundColor(Colors.heavyblack);
                break;
            case "Recommendations":
                setBackgroundColor(Colors.heavyblack);
                break;
            case "Account":
                setBackgroundColor(Colors.black);
                break;
            default:
                setBackgroundColor(Colors.black);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderTopWidth: 0,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        overflow: "hidden",
                        width: "95%",
                        alignSelf: "center",
                        paddingBottom: 10,
                    },
                    tabBarIcon: ({ color, size }) => {
                        const iconStyle = { marginTop: 3 };
                        size = 25;
                        if (route.name === "Playlist") {
                            return (
                                <PlaylistIcon color={color} style={iconStyle} />
                            );
                        } else if (route.name === "Recommendations") {
                            return (
                                <RecommendationsIcon
                                    color={color}
                                    style={iconStyle}
                                />
                            );
                        } else if (route.name === "Account") {
                            return (
                                <AccountIcon color={color} style={iconStyle} />
                            );
                        }
                    },
                    tabBarLabel: () => null,
                    tabBarActiveTintColor: "#ff7f50",
                    tabBarInactiveTintColor: "#ffffff",
                })}
            >
                <Tab.Screen
                    name='Playlist'
                    options={{
                        tabBarLabel: "Playlist",
                    }}
                    component={Playlist}
                    listeners={{
                        focus: () => handleFocus("Playlist"),
                    }}
                />
                <Tab.Screen
                    name='Recommendations'
                    options={{
                        tabBarLabel: "Recommendations",
                    }}
                    component={Recomendations}
                    listeners={{
                        focus: () => handleFocus("Recommendations"),
                    }}
                />
                <Tab.Screen
                    name='Account'
                    options={{

                        tabBarLabel: "Account",
                    }}
                    component={Account}
                    listeners={{
                        focus: () => handleFocus("Account"),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
    },
});
