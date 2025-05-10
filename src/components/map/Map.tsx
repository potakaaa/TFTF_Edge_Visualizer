"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FeatureCollection } from "geojson";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/images/marker-icon.png",
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

type MapProps = {
  center: [number, number];
  zoom?: number;
  geoJsonPath?: FeatureCollection;
};

const Map = ({ center, zoom = 13, geoJsonPath }: MapProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet");
    }
  }, []);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties?.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  const style = (feature: any) => {
    if (feature.geometry.type === "Point") {
      return {
        color: feature.properties["marker-color"] || "#000",
        fillColor: feature.properties["marker-color"] || "#000",
        fillOpacity: 1,
        radius: 8,
        weight: 2,
      };
    }

    return {
      color: feature.properties.stroke || "#1b1c1c",
      weight: 3,
      opacity: 1,
    };
  };

  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: feature.properties["marker-color"] || "#000",
      color: feature.properties["marker-color"] || "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 1,
    });
  };

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

      {geoJsonPath && (
        <GeoJSON
          data={geoJsonPath}
          style={style}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
          coordsToLatLng={(coords) => L.latLng(coords[1], coords[0])}
        />
      )}
    </MapContainer>
  );
};

export default Map;
