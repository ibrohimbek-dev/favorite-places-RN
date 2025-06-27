import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, View, Alert, Image, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../ui/OutlinedButton";

const ImagePickerComponent = () => {
	const [pickedImage, setPickedImage] = useState();

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
				// You would typically set this URI to state here
				// console.log("Image URI:", result.assets[0].uri);

				setPickedImage(result.assets[0].uri);
			}
		} catch (err) {
			console.log("Error taking image:", err);
			Alert.alert("Error", "Could not take image. Please try again.");
		}
	};

	let imagePreview = <Text>No image taken yet.</Text>;

	if (pickedImage) {
		imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
	}

	return (
		<View>
			<View style={styles.imagePreview}>{imagePreview}</View>
			<OutlinedButton icon={"camera"} onPress={takeImageHandler}>
				Take Image
			</OutlinedButton>
		</View>
	);
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
	imagePreview: {
		width: "100%",
		height: 200,
		marginVertical: 8,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.secondary100,
		borderRadius: 4,
	},

	image: {
		width: "100%",
		height: "100%",
	},
});
