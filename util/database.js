import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

let databaseInstance = null;

export async function initDatabase() {
	if (!databaseInstance) {
		databaseInstance = await SQLite.openDatabaseAsync("places.db");
		await databaseInstance.execAsync(`
     CREATE TABLE IF NOT EXISTS places_new (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
      );
    `);
	}
	return databaseInstance;
}

export async function getDatabase() {
	if (!databaseInstance) {
		await initDatabase();
	}
	return databaseInstance;
}

export async function insertPlace(place) {
	try {
		if (!databaseInstance) {
			await initDatabase();
		}

		const addressToStore = Array.isArray(place.address)
			? place.address[0]
			: place.address;
		const addressString = JSON.stringify([addressToStore]); // Store as proper JSON array

		const result = await databaseInstance.runAsync(
			`INSERT INTO places (title, imageUri, address, lat, lng)
     VALUES (?, ?, ?, ?, ?)`,
			[
				place.title,
				place.imageUri,
				addressString,
				place.location.lat,
				place.location.lng,
			]
		);
		return result;
	} catch (error) {
		console.error("Error inserting place:", error);
		throw error;
	}
}

export async function fetchPlaces() {
	try {
		// Ensure database is initialized
		if (!databaseInstance) {
			await initDatabase();
		}

		// Execute query
		const result = await databaseInstance.getAllAsync("SELECT * FROM places");

		// Validate result
		if (!result || !Array.isArray(result)) {
			console.warn("No places found or invalid result format");
			return [];
		}

		// Transform results with validation
		const places = result
			.map((dp) => {
				// Validate required fields
				if (
					!dp.title ||
					!dp.imageUri ||
					!dp.address ||
					typeof dp.lat !== "number" ||
					typeof dp.lng !== "number"
				) {
					return null;
				}

				return new Place(
					dp.title,
					dp.imageUri,
					{
						address: dp.address,
						lat: dp.lat,
						lng: dp.lng,
					},
					dp.id
				);
			})
			.filter((place) => place !== null); // Remove any invalid entries

		return places;
	} catch (error) {
		console.error("Failed to fetch places:", error);
		throw new Error("Failed to load places. Please try again later.");
	}
}

export async function fetchPlaceDetails(id) {
	try {
		if (!databaseInstance) {
			await initDatabase();
		}

		const dbPlace = await databaseInstance.getFirstAsync(
			"SELECT * FROM places WHERE id = ?",
			[id]
		);

		if (!dbPlace) {
			// console.warn(`No place found with id: ${id}`);
			return null;
		}

		// Parse the address if it's stored as JSON string
		let address = dbPlace.address;
		try {
			const parsedAddress = JSON.parse(address);
			if (Array.isArray(parsedAddress)) {
				address = parsedAddress;
			}
		} catch (e) {
			// If parsing fails, keep the original address
			console.log("Address is not in JSON format, using as-is");
		}

		const place = new Place(
			dbPlace.title,
			dbPlace.imageUri,
			{
				lat: dbPlace.lat,
				lng: dbPlace.lng,
				address: address,
			},
			dbPlace.id
		);
		return place;
	} catch (error) {
		console.error("Error fetching place details:", error);
		throw error;
	}
}

export async function clearDatabase() {
	try {
		if (!databaseInstance) {
			await initDatabase();
		}

		await databaseInstance.execAsync(`
      DELETE FROM places;
    `);
		return true;
	} catch (error) {
		console.error("Error clearing database:", error);
		return false;
	}
}
