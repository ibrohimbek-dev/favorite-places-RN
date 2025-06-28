// contexts/PlacesContext.js
import React, { createContext, useState } from "react";

export const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const triggerRefresh = () => {
		setRefreshTrigger((prev) => prev + 1);
	};

	return (
		<PlacesContext.Provider value={{ refreshTrigger, triggerRefresh }}>
			{children}
		</PlacesContext.Provider>
	);
};
