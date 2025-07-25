import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IconButton({ icon, color, size, onPress, onPressIn }) {
	return (
		<Pressable
			style={({ pressed }) => [styles.button, pressed && styles.pressed]}
			onPressIn={onPressIn}
			onPress={onPress}
		>
			<Ionicons name={icon} color={color} size={size} />
		</Pressable>
	);
}

export default IconButton;

const styles = StyleSheet.create({
	button: {
		marginRight: 6,
		justifyContent: "center",
		alignItems: "center",
	},
	pressed: {
		opacity: 0.7,
	},
});
