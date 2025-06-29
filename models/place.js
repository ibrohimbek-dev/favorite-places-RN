import * as Crypto from "expo-crypto";

// Custom UUID generator for React Native
function generateUUID() {
	const uniqueId = Crypto.randomUUID(); // Uses native crypto support
	return uniqueId;
}

export class Place {
	constructor(title, imageUri, location, id) {
		this.title = title;
		this.imageUri = imageUri;
		this.address = location?.address;
		this.location = { lat: location?.lat, lng: location?.lng };
		this.id = id || generateUUID();
	}

	// This ensures proper serialization
	toJSON() {
		return {
			id: this.id,
			title: this.title,
			imageUri: this.imageUri,
			address: this.address,
			location: this.location,
		};
	}
}
