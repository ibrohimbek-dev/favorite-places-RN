import {
	getCurrentPositionAsync,
	PermissionStatus,
	requestForegroundPermissionsAsync,
	getForegroundPermissionsAsync,
} from "expo-location";
import { Alert } from "react-native";

export const verifyLocationPermissions = async () => {
	const { status } = await getForegroundPermissionsAsync();

	if (status === PermissionStatus.UNDETERMINED) {
		const { status: newStatus } = await requestForegroundPermissionsAsync();
		return newStatus === PermissionStatus.GRANTED;
	}

	if (status === PermissionStatus.DENIED) {
		Alert.alert(
			"Insufficient Permissions!",
			"You need to grant location permissions to use this app."
		);
		return false;
	}

	return true;
};

export const getCurrentLocation = async () => {
	const hasPermission = await verifyLocationPermissions();

	if (!hasPermission) {
		return null;
	}

	try {
		const location = await getCurrentPositionAsync();
		return {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		};
	} catch (err) {
		Alert.alert(
			"Could not fetch location!",
			"Please try again later or pick a location on the map."
		);
		return null;
	}
};

export async function getAddress(lat, lng) {
	const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

	try {
		const response = await fetch(url);

		const data = await response.json();
		if (data.address) {
			const { road, house_number, postcode, town, country } = data.address;
			const formattedAddress = `${road} ${house_number}, ${postcode} ${town}, ${country}`;

			return formattedAddress;
		}
	} catch (error) {
		throw new Error("Failed to fetch address!");
	}
}
