import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../util/location";
import IconButton from "../components/ui/IconButton";

const Map = ({ navigation }) => {
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [currentLocation, setCurrentLocation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLocation = async () => {
			try {
				const position = await getCurrentLocation();
				if (position) {
					setCurrentLocation({
						lat: position.latitude,
						lng: position.longitude,
					});
				}
			} catch (error) {
				console.error("Error getting location:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLocation();
	}, [getCurrentLocation, setCurrentLocation, setIsLoading]);

	function selectLocationHandler(event) {
		const { latitude, longitude } = event.nativeEvent.coordinate;
		setSelectedLocation({
			lat: latitude,
			lng: longitude,
		});
	}

	const savePickedLocationHandler = useCallback(() => {
		if (!selectedLocation) {
			Alert.alert(
				"No location picked!",
				"You have to pick a location (by tapping on the map) first!"
			);
			return;
		}

		navigation.navigate("AddPlace", {
			pickedLat: selectedLocation.lat,
			pickedLng: selectedLocation.lng,
		});
	}, [navigation, selectedLocation]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<IconButton
					icon="save"
					size={24}
					color={tintColor}
					onPress={savePickedLocationHandler}
				/>
			),
		});
	}, [navigation, savePickedLocationHandler]);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Loading your location...</Text>
			</View>
		);
	}

	if (!currentLocation) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Unable to determine your location</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: currentLocation.lat,
					longitude: currentLocation.lng,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				onPress={selectLocationHandler}
			>
				<Marker
					coordinate={{
						latitude: currentLocation.lat,
						longitude: currentLocation.lng,
					}}
					title="Your Location"
					pinColor="blue"
				/>
				{selectedLocation && (
					<Marker
						coordinate={{
							latitude: selectedLocation.lat,
							longitude: selectedLocation.lng,
						}}
						title="Picked Location"
					/>
				)}
			</MapView>
		</View>
	);
};

export default Map;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: "100%",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
