import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import OutlinedButton from "../ui/OutlinedButton";
import { Colors } from "../../constants/colors";
import {
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { getCurrentLocation } from "../../util/location";
import { reverseGeocodeAsync } from "expo-location";

const LocationPicker = ({ onPickLocation }) => {
	const navigation = useNavigation();
	const route = useRoute();
	const isFocused = useIsFocused();
	const [pickedLocation, setPickedLocation] = useState(null);

	const handleGetLocation = async () => {
		const position = await getCurrentLocation();
		if (position) {
			setPickedLocation({
				lat: position.latitude,
				lng: position.longitude,
			});
		}
	};

	useEffect(() => {
		if (isFocused && route.params) {
			const mapPickedLocation = route.params && {
				lat: route.params.pickedLat,
				lng: route.params.pickedLng,
			};
			setPickedLocation(mapPickedLocation);
		}
	}, [route, isFocused]);

	useEffect(() => {
		async function getAddress() {
			if (pickedLocation) {
				const address = await reverseGeocodeAsync({
					latitude: pickedLocation.lat,
					longitude: pickedLocation.lng,
				});
				onPickLocation({ ...pickedLocation, address: address });
			}
		}

		getAddress();
	}, [pickedLocation, onPickLocation]);

	const pickOnMapHandler = () => {
		navigation.navigate("Map");
	};

	return (
		<View style={styles.container}>
			<View style={styles.mapPreview}>
				{pickedLocation ? (
					<MapView
						style={styles.map}
						initialRegion={{
							latitude: pickedLocation.lat,
							longitude: pickedLocation.lng,
							latitudeDelta: 0.0922,
							longitudeDelta: 0.0421,
						}}
						scrollEnabled={false}
						zoomEnabled={false}
						rotateEnabled={false}
						pitchEnabled={false}
					>
						<Marker
							coordinate={{
								latitude: pickedLocation.lat,
								longitude: pickedLocation.lng,
							}}
							pinColor={Colors.primary500}
						/>
					</MapView>
				) : (
					<View style={styles.fallback}>
						<Text style={styles.fallbackText}>No location chosen yet!</Text>
					</View>
				)}
			</View>
			<View style={styles.actions}>
				<OutlinedButton
					icon="location"
					onPress={handleGetLocation}
					style={styles.button}
				>
					Locate User
				</OutlinedButton>
				<OutlinedButton
					icon="map"
					onPress={pickOnMapHandler}
					style={styles.button}
				>
					Pick on Map
				</OutlinedButton>
			</View>
		</View>
	);
};

export default LocationPicker;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mapPreview: {
		width: "100%",
		height: 200,
		marginVertical: 12,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.secondary100,
		borderRadius: 4,
		overflow: "hidden",
		elevation: 2, // Android shadow
		shadowColor: "#000", // iOS shadow
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	map: {
		width: "100%",
		height: "100%",
	},
	fallback: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	fallbackText: {
		fontSize: 16,
		color: Colors.gray700,
		textAlign: "center",
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	button: {
		minWidth: "48%",
		marginHorizontal: 4,
	},
});
