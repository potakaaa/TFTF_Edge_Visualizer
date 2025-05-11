"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import FitBoundsGeoJSON from "./FitBoundsGeoJSON";

// Fix for marker icons
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
    // Ensure all layers are interactive
    (layer as any).options.interactive = true;

    if (feature.properties?.route_name || feature.properties?.marker) {
      const label =
        feature.properties.route_name || feature.properties.marker || "Info";

      layer.bindTooltip(label, {
        direction: "top",
        opacity: 0.9,
        permanent: false,
        sticky: true,
      });

      // Explicit hover behavior (for LineStrings especially)
      layer.on("mouseover", function (this: L.Layer) {
        this.openTooltip();
      });
      layer.on("mouseout", function (this: L.Layer) {
        this.closeTooltip();
      });
    }
  };

  const style = (feature: any) => {
    return {
      color: feature.properties.stroke || "#1b1c1c",
      weight: 3,
      opacity: 1,
      interactive: true,
    };
  };

  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    return L.circleMarker(latlng, {
      radius: 8,
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
        attribution='<a href="https://www.maptiler.com/copyright/
" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright
" target="_blank">&copy; OpenStreetMap contributors</a>'
        url="https://api.maptiler.com/maps/basic-v2-light/{z}/{x}/{y}.png?key=SlZNxUiHmBSoWZ1YUoLb
"
      />

      {geoJsonPath && (
        <>
          <GeoJSON
            key={JSON.stringify(geoJsonPath)}
            data={geoJsonPath}
            style={style}
            onEachFeature={onEachFeature}
            pointToLayer={pointToLayer}
            coordsToLatLng={(coords) => L.latLng(coords[1], coords[0])}
          />
          <FitBoundsGeoJSON geoJson={geoJsonPath} />
        </>
      )}
    </MapContainer>
  );
};

export default Map;
