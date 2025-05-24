"use client";

import { useRouteStore } from "@/store/path";
import { calculateGeoJSONCenter } from "@/utils/calculateGeoJSONCenter";
import { assignColorsToGeoJSON } from "@/utils/colorGeoJSON";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper = () => {
  const geoJSON = useRouteStore((state) => state.geojson);
  const center = calculateGeoJSONCenter(geoJSON);
  const { fare_list, total_fare, route_names, distance, total_distance } =
    useRouteStore((state) => state);

  console.log("Distance:", distance);
  console.log("Total fare:", total_fare);
  console.log("Route names:", route_names);
  console.log("Fare list:", fare_list);

  console.log("Calculated center:", center);

  useEffect(() => {
    if (geoJSON) {
      console.log("GeoJSON data:", geoJSON);
    } else {
      console.error("GeoJSON data is not available");
    }
  }, [geoJSON]);

  return (
    <div className="w-full h-full flex gap-10">
      <div className="flex flex-[5]">
        <Map center={center} geoJsonPath={assignColorsToGeoJSON(geoJSON)} />
      </div>
      <div className="w-full flex flex-[2]">
        {route_names && (
          <Table className="max-w-md">
            <TableCaption>Routes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Fare</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {route_names.map((name, index) => (
                <TableRow key={index}>
                  <TableCell className="line-clamp-2 truncate whitespace-normal text-ellipsis">
                    {name}
                  </TableCell>
                  <TableCell>{distance[index]} km</TableCell>
                  <TableCell>{fare_list[index]} PHP</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={1}>Total</TableCell>
                <TableCell>{total_distance.toFixed(2)} km</TableCell>
                <TableCell>{total_fare.toFixed(2)} PHP</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ClientMapWrapper;
