import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Button, View, Alert } from "react-native";

const ImagePickerComponent = () => {
	const verifyPermissions = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Insufficient permissions!",
				"You need to grant camera permissions to use this feature.",
				[{ text: "Okay" }]
			);
			return false;
		}
		return true;
	};

	const takeImageHandler = async () => {
		try {
			const hasPermission = await verifyPermissions();
			if (!hasPermission) return;

			const result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [16, 9],
				quality: 0.5,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				// console.log("Image URI:", result.assets[0].uri);
				// You would typically set this URI to state here
			}
		} catch (err) {
			console.log("Error taking image:", err);
			Alert.alert("Error", "Could not take image. Please try again.");
		}
	};

	return (
		<View>
			<Button title="Take Image" onPress={takeImageHandler} />
		</View>
	);
};

export default ImagePickerComponent;
