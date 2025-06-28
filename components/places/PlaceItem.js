import React from "react";
import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import MyButton from "../ui/MyButton";

const PlaceItem = ({ place, onSelect }) => {
	let addressText = "Address not available";

	try {
		// First fix the malformed JSON (replace = with :)
		const fixedJson = place.address.replace(/=/g, ":");
		// Parse the JSON string to array
		const addressArray = JSON.parse(fixedJson);
		// Get first address object
		const addressObj = addressArray[0];

		// Create display text
		addressText =
			addressObj.formattedAddress ||
			[addressObj.street, addressObj.streetNumber, addressObj.city]
				.filter(Boolean)
				.join(", ");
	} catch (error) {
		console.error("Error parsing address:", error);
	}

	return (
		<Pressable
			onPress={onSelect}
			style={({ pressed }) => [styles.item, pressed && styles.pressed]}
		>
			<View style={styles.imageContainer}>
				<Image source={{ uri: place.imageUri }} style={styles.image} />
			</View>
			<View style={styles.info}>
				<Text style={styles.title}>{place.title}</Text>
				<Text style={styles.address}>{addressText}</Text>
			</View>
		</Pressable>
	);
};

export default PlaceItem;

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		marginVertical: 4,
		backgroundColor: "white",
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		overflow: "hidden",
		marginHorizontal: 4,
	},
	pressed: {
		opacity: 0.8,
		transform: [{ scale: 0.98 }],
	},

	imageContainer: {
		padding: 2,
		overflow: "hidden",
	},

	image: {
		width: 150,
		height: 150,
		backgroundColor: "#f5f5f5", // Fallback color if image fails to load
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
	},
	info: {
		flex: 1,
		padding: 4,
	},
	title: {
		fontWeight: "700",
		fontSize: 16,
		marginBottom: 6,
		color: "#333",
	},
	address: {
		fontSize: 14,
		color: "#666",
	},
	fallbackImage: {
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#e1e1e1",
	},
	fallbackText: {
		color: "#999",
		fontSize: 12,
	},
});
