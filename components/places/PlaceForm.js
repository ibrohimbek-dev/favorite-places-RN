import React, { useCallback, useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import MyButton from "../ui/MyButton";
import { Place } from "../../models/place";

const PlaceForm = ({ onCreatePlace }) => {
	const [enteredTitle, setEnteredTitle] = useState("");
	const [selectedImage, setSelectedImage] = useState();
	const [pickedLocation, setPickedLocation] = useState();

	function changeTitleHandler(enteredText) {
		setEnteredTitle(enteredText);
	}

	function savePlaceHandler() {
		// Check if required fields are empty
		if (!enteredTitle || enteredTitle.trim().length === 0) {
			Alert.alert("Invalid input", "Please enter a valid title");
			return;
		}

		if (!selectedImage) {
			Alert.alert("Invalid input", "Please select an image");
			return;
		}

		if (!pickedLocation) {
			Alert.alert("Invalid input", "Please select a location");
			return;
		}

		// All validations passed - create and save the place
		const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
		onCreatePlace(placeData);
	}

	function takeImageHandler(imageUri) {
		setSelectedImage(imageUri);
	}

	const pickLocationHandler = useCallback((location) => {
		setPickedLocation(location);
	}, []);

	return (
		<ScrollView style={styles.form}>
			<View>
				<Text style={styles.label}>Title</Text>
				<TextInput
					style={styles.input}
					onChangeText={changeTitleHandler}
					value={enteredTitle}
				/>
			</View>

			<ImagePicker onTakeImage={takeImageHandler} />
			<LocationPicker onPickLocation={pickLocationHandler} />
			<MyButton onPress={savePlaceHandler}>Add Place</MyButton>
		</ScrollView>
	);
};

export default PlaceForm;

const styles = StyleSheet.create({
	form: {
		flex: 1,
		padding: 24,
	},

	label: {
		fontWeight: "bold",
		marginBottom: 4,
		color: Colors.secondary100,
	},

	input: {
		marginVertical: 8,
		paddingHorizontal: 4,
		paddingVertical: 8,
		fontSize: 16,
		borderBottomColor: Colors.secondary700,
		borderBottomWidth: 2,
		backgroundColor: Colors.secondary100,
	},
});
