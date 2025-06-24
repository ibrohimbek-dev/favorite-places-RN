class Place {
	constructor(title, imageUri, address, location) {
		this.title = title;
		this.imageUri = imageUri;
		this.address = address;
		this.location = location; // {lat: 0000, lng: 0000}
		this.id = new Date().toString() + Math.random().toString();
	}
}
