import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/ui/IconButton";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<>
			<StatusBar style="dark" />
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="AllPlaces"
						component={AllPlaces}
						options={{
							headerRight: ({ tintColor }) => (
								<IconButton
									icon="add"
									size={24}
									color={"red"}
									// onPress={() => navigation.navigate("AddPlace")}
								/>
							),
						}}
					/>
					<Stack.Screen name="AddPlace" component={AddPlace} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}
