import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

let databaseInstance = null;

export async function initDatabase() {
	if (!databaseInstance) {
		databaseInstance = await SQLite.openDatabaseAsync("places.db");
		await databaseInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY NOT NULL,
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
					console.warn("Skipping invalid place data:", dp);
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

		// console.log(`Successfully fetched =>`, places[0]);
		return places;
	} catch (error) {
		console.error("Failed to fetch places:", error);
		throw new Error("Failed to load places. Please try again later.");
	}
}

// export async function fetchPlaceDetails(id) {
// 	const dbPlace = await databaseInstance.getFirstAsync(
// 		"SELECT * FROM places WHERE id = ?",
// 		[id]
// 	);
// 	const place = new Place(
// 		dbPlace.title,
// 		dbPlace.imageUri,
// 		{ lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address },
// 		dbPlace.id
// 	);

// 	return place;
// }

export async function clearDatabase() {
	try {
		if (!databaseInstance) {
			await initDatabase();
		}

		await databaseInstance.execAsync(`
      DELETE FROM places;
    `);
		console.log("All data deleted successfully");
		return true;
	} catch (error) {
		console.error("Error clearing database:", error);
		return false;
	}
}
