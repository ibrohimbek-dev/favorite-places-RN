import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/ui/IconButton";
import { Colors } from "./constants/colors";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Map from "./screens/Map";
import AppLoading from "expo-app-loading";
import { initDatabase } from "./util/database";
import { StyleSheet, View } from "react-native";
import { PlacesProvider } from "./context/place-context";
import ClearButton from "./components/ui/ClearButton";
import PlaceDetails from "./screens/PlaceDetails";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
	const [fontsLoaded, fontError] = useFonts({
		...Ionicons.font,
	});

	const [dbInitialized, setDbInitialized] = useState(false);

	useEffect(() => {
		initDatabase()
			.then(() => {
				setDbInitialized(true);
			})
			.catch((err) => {
				console.log("Error on initDatabase() =>", err);
			});
	}, []);

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	if (!dbInitialized) {
		return <AppLoading />;
	}

	return (
		<>
			<StatusBar style="light" />
			<PlacesProvider>
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerStyle: { backgroundColor: Colors.secondary300 },
							headerTintColor: Colors.gray700,
							contentStyle: { backgroundColor: Colors.gray700 },
						}}
					>
						<Stack.Screen
							name="AllPlaces"
							component={AllPlaces}
							options={({ navigation }) => ({
								title: "All Places",
								headerShown: true,
								headerRight: ({ tintColor }) => {
									return (
										<View style={styles.headerIconContainer}>
											<IconButton
												icon={"add"}
												color={tintColor}
												size={24}
												onPress={() => navigation.navigate("AddPlace")}
												onPressIn={() => navigation.navigate("AddPlace")}
											/>

											<ClearButton tintColor={tintColor} />
										</View>
									);
								},
							})}
						/>
						<Stack.Screen
							name="AddPlace"
							component={AddPlace}
							options={{
								title: "Add a New Place",
							}}
						/>

						<Stack.Screen
							name="Map"
							component={Map}
							options={{
								title: "Pick on a Map",
							}}
						/>
						<Stack.Screen
							name="PlaceDetails"
							component={PlaceDetails}
							options={{
								title: "Loading Place...",
							}}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</PlacesProvider>
		</>
	);
}

const styles = StyleSheet.create({
	headerIconContainer: {
		flexDirection: "row",
	},
});
