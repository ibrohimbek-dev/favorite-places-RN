import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

const PlaceItem = ({ place, onSelect }) => {
	return (
		<Pressable onPress={onSelect}>
			<Image source={{ uri: place.imageUri }} />
			<View>
				<View>{place.title}</View>
				<View>{place.address}</View>
			</View>
		</Pressable>
	);
};

export default PlaceItem;

const styles = StyleSheet.create({});
