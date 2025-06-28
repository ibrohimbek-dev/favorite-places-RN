// components/ClearButton.js
import React, { useContext } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PlacesContext } from "../../context/place-context";
import { clearDatabase } from "../../util/database";

const ClearButton = ({ tintColor }) => {
	const { triggerRefresh } = useContext(PlacesContext);

	const handlePress = async () => {
		Alert.alert(
			"Clear All Data",
			"Are you sure you want to delete all places?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Clear",
					style: "destructive",
					onPress: async () => {
						await clearDatabase();
						triggerRefresh();
					},
				},
			]
		);
	};

	return (
		<TouchableOpacity onPress={handlePress} style={{ marginLeft: 16 }}>
			<MaterialCommunityIcons name="broom" size={24} color={tintColor} />
		</TouchableOpacity>
	);
};

export default ClearButton;
