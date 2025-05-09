"use client";

import { useRouteStore } from "@/store/path";
import dynamic from "next/dynamic";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper = () => {
  const usePathStore = useRouteStore();
  console.log(
    "Coordinates from state on container: ",
    usePathStore.coordinates
  );
  return (
    <Map
      center={[8.4542, 124.6319]}
      // markers={[
      //   { position: [8.4542, 124.6319], popup: "Cagayan de Oro" },
      //   { position: [8.48, 124.64], popup: "Uptown" },
      // ]}
      path={usePathStore.coordinates.map((coord) => ({
        lat: coord[1],
        lng: coord[0],
      }))}
    />
  );
};

export default ClientMapWrapper;
