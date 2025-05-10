"use client";

import { useRouteStore } from "@/store/path";
import dynamic from "next/dynamic";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper = () => {
  const geoJSON = useRouteStore((state) => state.geojson);

  console.log("GeoJSON data:", geoJSON);

  return <Map center={[8.4542, 124.6319]} geoJsonPath={geoJSON} />;
};

export default ClientMapWrapper;
