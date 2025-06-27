import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/colors";

const OutlinedButton = ({ onPress, icon, children }) => {
	return (
		<Pressable
			style={({ pressed }) => [styles.button, pressed && styles.pressed]}
			onPress={onPress}
		>
			<Ionicons
				style={styles.icon}
				name={icon}
				size={18}
				color={Colors.secondary500}
			/>
			<Text style={styles.text}>{children}</Text>
		</Pressable>
	);
};

export default OutlinedButton;

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		margin: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: Colors.secondary500,
		backgroundColor: Colors.gray300,
	},

	pressed: {
		opacity: 0.7,
	},

	icon: {
		marginRight: 6,
	},

	text: {
		color: Colors.secondary500,
		fontWeight: "bold",
	},
});
