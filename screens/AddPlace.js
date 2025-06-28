import React from "react";
import PlaceForm from "../components/places/PlaceForm";
import { insertPlace } from "../util/database";

const AddPlace = ({ navigation }) => {
	async function createPlaceHandler(place) {
		await insertPlace(place);
		navigation.navigate("AllPlaces");
		// navigation.navigate("AllPlaces", {
		// 	place: place,
		// });
	}

	return <PlaceForm onCreatePlace={createPlaceHandler} />;
};

export default AddPlace;
