"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FeatureCollection, Feature, Point, LineString } from "geojson";

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
  geoJsonPath?: GeoJSON.Feature | GeoJSON.FeatureCollection;
};

const Map = ({ center, zoom = 13, markers, path, geoJsonPath }: MapProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet");
    }
  }, []);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
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

  // Separate Point and LineString features
  const pointFeatures =
    geoJsonPath?.type === "FeatureCollection"
      ? (geoJsonPath as FeatureCollection).features.filter(
          (f) => f.geometry.type === "Point"
        )
      : [];

  const lineFeatures =
    geoJsonPath?.type === "FeatureCollection"
      ? (geoJsonPath as FeatureCollection).features.filter(
          (f) => f.geometry.type === "LineString"
        )
      : [];

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
      {/* {markers?.map((marker, i) => (
        <Marker key={i} position={marker.position}>
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))} */}

      {/* Render LineString features */}
      {lineFeatures.length > 0 && (
        <GeoJSON
          data={
            {
              type: "FeatureCollection",
              features: lineFeatures,
            } as FeatureCollection
          }
          style={style}
          onEachFeature={onEachFeature}
          coordsToLatLng={(coords) => {
            return L.latLng(coords[1], coords[0]);
          }}
        />
      )}

      {/* Render Point features */}
      {pointFeatures.length > 0 && (
        <GeoJSON
          data={
            {
              type: "FeatureCollection",
              features: pointFeatures,
            } as FeatureCollection
          }
          style={style}
          onEachFeature={onEachFeature}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 8,
              fillColor: feature.properties["marker-color"] || "#000",
              color: feature.properties["marker-color"] || "#000",
              weight: 2,
              opacity: 1,
              fillOpacity: 1,
            });
          }}
          coordsToLatLng={(coords) => {
            return L.latLng(coords[1], coords[0]);
          }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
