"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/images/marker-icon.png",
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

type MapProps = {
  center: [number, number];
  zoom?: number;
  markers?: {
    position: [number, number];
    popup: string;
  }[];
  path?: {
    lat: number;
    lng: number;
  }[];
};

const Map = ({ center, zoom = 13, markers, path }: MapProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet");
    }
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="size-full rounded-2xl w-full shadow-xl z-0 border-2 border-muted-foreground"
    >
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        url="https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=SlZNxUiHmBSoWZ1YUoLb"
      />
      {markers?.map((marker, i) => (
        <Marker key={i} position={marker.position}>
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))}
      {path && (
        <Polyline
          positions={path.map((point) => [point.lat, point.lng])}
          color="#1b1c1c"
          weight={2}
        />
      )}
    </MapContainer>
  );
};

export default Map;
