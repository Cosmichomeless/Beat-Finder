import {
    MaterialCommunityIcons,
    MaterialIcons,
    AntDesign,
    SimpleLineIcons,
    FontAwesome,
    Octicons,
    Feather,
    Entypo,
    Ionicons,
} from "@expo/vector-icons";
import { Colors } from "../constants/colors";

export const SettingsIcon = (props) => {
    return (
        <AntDesign name='setting' size={24} color={Colors.white} {...props} />
    );
};

export const TrophyIcon = (props) => {
    return (
        <SimpleLineIcons
            name='trophy'
            size={24}
            color={Colors.white}
            {...props}
        />
    );
};
export const PlaylistIcon = (props) => {
    return (
       <Ionicons name="grid" size={24} color={Colors.white} {...props} />
    );
};

export const RecommendationsIcon = (props) => {
    return (
        <MaterialCommunityIcons
            name='cards'
            size={25}
            color={Colors.white}
            {...props}
        />
    );
};

export const AccountIcon = (props) => {
    return (
        <FontAwesome
            name='user-circle-o'
            size={25}
            color={Colors.white}
            {...props}
        />
    );
};

export const EyeIcon = (props) => {
    return (
        <Octicons
            name={props.showPassword ? "eye-closed" : "eye"}
            size={20}
            color={Colors.white}
            {...props}
        />
    );
};

export const HistoryIcon = (props) => {
    return <Feather name='clock' size={30} color={Colors.white} {...props} />;
};

export const Add_track = (props) => {
    return (
        <Entypo name='add-to-list' size={30} color={Colors.white} {...props} />
    );
};

export const RefreshIcon = (props) => {
    return (
        <Feather
            name='refresh-ccw'
            size={20}
            color={Colors.white}
            {...props}
        />
    );
};

export const statisticsIcon = (props) => {
    return (
        <Ionicons
            name='stats-chart'
            size={30}
            color={Colors.white}
            {...props}
        />
    );
}
