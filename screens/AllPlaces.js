import React, { useContext, useEffect, useState } from "react";
import PlacesList from "../components/places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";
import { PlacesContext } from "../context/place-context";

const AllPlaces = ({ route }) => {
	const isFocused = useIsFocused();
	const { refreshTrigger } = useContext(PlacesContext);
	const [loadedPlaces, setLoadedPlaces] = useState([]);

	useEffect(() => {
		console.log("AllPlaces");
		async function loadPlaces() {
			const places = await fetchPlaces();
			setLoadedPlaces(places);
		}
		if (isFocused) {
			loadPlaces();
			// setLoadedPlaces((currPlaces) => [...currPlaces, route?.params?.place]);
		}
	}, [isFocused, refreshTrigger]);

	return <PlacesList places={loadedPlaces} />;
};

export default AllPlaces;
