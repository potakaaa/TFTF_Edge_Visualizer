import { Coordinate } from "@/types/coordinates";

export const getRouteData = async (
  startCoords: Coordinate,
  endCoords: Coordinate
) => {
  const queryParams = new URLSearchParams({
    fromLat: startCoords.lat.toString(),
    fromLong: startCoords.lng.toString(),
    toLat: endCoords.lat.toString(),
    toLong: endCoords.lng.toString(),
  });
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/routes?${queryParams}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
};
