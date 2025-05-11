import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const FitBoundsGeoJSON = ({ geoJson }: { geoJson: any }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson) return;

    const geoJsonLayer = L.geoJSON(geoJson);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geoJson, map]);

  return null;
};
export default FitBoundsGeoJSON;
