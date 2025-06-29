import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "../components/ui/OutlinedButton";
import { Colors } from "../constants/colors";
import { fetchPlaceDetails } from "../util/database";

const PlaceDetails = ({ route, navigation }) => {
	const [fetchedPlace, setFetchedPlace] = useState();

	const showOnMapHandler = () => {
		navigation.navigate("Map", {
			initialLat: fetchedPlace.location.lat,
			initialLng: fetchedPlace.location.lng,
		});
	};

	const selectedPlaceId = route.params.placeId;

	useEffect(() => {
		async function loadPlaceData() {
			const placeDetail = await fetchPlaceDetails(selectedPlaceId);
			setFetchedPlace(placeDetail);
			navigation.setOptions({
				title: placeDetail.title,
			});
		}
		loadPlaceData();
	}, [selectedPlaceId, navigation]);

	if (!fetchedPlace) {
		return (
			<View style={styles.fallback}>
				<Text>Loading place data...</Text>
			</View>
		);
	}

	// Parse the address if it's stored as JSON string
	let displayAddress = "No address available";

	// Check if address exists and is in the correct format
	if (fetchedPlace.address) {
		try {
			// If address is a string, parse it
			const addressData =
				typeof fetchedPlace.address === "string"
					? JSON.parse(fetchedPlace.address)
					: fetchedPlace.address;

			// Handle both array and object formats
			const addressObj = Array.isArray(addressData)
				? addressData[0]
				: addressData;

			// Create the display text
			displayAddress =
				addressObj.formattedAddress ||
				[addressObj.streetNumber, addressObj.street, addressObj.city]
					.filter(Boolean)
					.join(", ");
		} catch (e) {
			console.warn("Error parsing address:", e);
			displayAddress = "Address format error";
		}
	}

	return (
		<ScrollView>
			<Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
			<View style={styles.locationContainer}>
				<View style={styles.addressContainer}>
					<Text style={styles.title}>{fetchedPlace.title}</Text>
					<Text style={styles.address}>{displayAddress}</Text>
				</View>
				<OutlinedButton icon="map" onPress={showOnMapHandler}>
					View on Map
				</OutlinedButton>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	image: {
		height: "35%",
		minHeight: 300,
		width: "100%",
		objectFit: "cover",
	},
	locationContainer: {
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	addressContainer: {
		padding: 20,
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 12,
		color: Colors.primary50,
	},
	address: {
		color: Colors.secondary50,
		textAlign: "center",
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 20,
	},
	fallback: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default PlaceDetails;
