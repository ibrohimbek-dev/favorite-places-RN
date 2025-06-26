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
import { useEffect } from "react";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
	const [fontsLoaded, fontError] = useFonts({
		...Ionicons.font,
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<>
			<StatusBar style="light" />
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
							title: "Your Places",
							headerShown: true,
							headerRight: ({ tintColor }) => {
								return (
									<IconButton
										icon={"add"}
										color={tintColor}
										size={24}
										onPress={() => navigation.navigate("AddPlace")}
										onPressIn={() => navigation.navigate("AddPlace")}
									/>
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
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}
