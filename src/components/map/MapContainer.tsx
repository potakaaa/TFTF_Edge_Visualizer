"use client";

import { useRouteStore } from "@/store/path";
import { calculateGeoJSONCenter } from "@/utils/calculateGeoJSONCenter";
import { assignColorsToGeoJSON } from "@/utils/colorGeoJSON";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper = () => {
  const geoJSON = useRouteStore((state) => state.geojson);
  const center = calculateGeoJSONCenter(geoJSON);

  console.log("Calculated center:", center);

  useEffect(() => {
    if (geoJSON) {
      console.log("GeoJSON data:", geoJSON);
    } else {
      console.error("GeoJSON data is not available");
    }
  }, [geoJSON]);

  return <Map center={center} geoJsonPath={assignColorsToGeoJSON(geoJSON)} />;
};

export default ClientMapWrapper;
