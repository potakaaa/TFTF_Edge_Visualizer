import { FeatureCollection, Feature, Geometry } from "geojson";
import { marker } from "leaflet";

export function assignColorsToGeoJSON(
  geojson: FeatureCollection
): FeatureCollection {
  const lineColors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
  ];

  return {
    ...geojson,
    features: geojson.features.map((feature, index) => {
      const geometryType = feature.geometry.type;

      if (geometryType === "Point") {
        const markerType = feature.properties?.marker?.toLowerCase() ?? "";
        const color = markerType.includes("start")
          ? "green"
          : markerType.includes("end")
          ? "red"
          : "#000";

        return {
          ...feature,
          properties: {
            ...feature.properties,
            stroke: color,
          },
        };
      }

      // Default for LineString, MultiLineString, etc.
      const color = lineColors[index % lineColors.length];
      return {
        ...feature,
        properties: {
          ...feature.properties,
          stroke: color,
        },
      };
    }),
  };
}
