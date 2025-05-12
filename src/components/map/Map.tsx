import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import FitBoundsGeoJSON from "./FitBoundsGeoJSON";
import { useRouteStore } from "@/store/path";
import { get } from "http";
import { getRouteData } from "@/services/route_service";

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

const DropPinHandler = ({
  dropMode,
  onDropStart,
  onDropEnd,
}: {
  dropMode: "none" | "start" | "end";
  onDropStart: (latlng: L.LatLng) => void;
  onDropEnd: (latlng: L.LatLng) => void;
}) => {
  useMapEvents({
    click(e) {
      if (dropMode === "start") {
        onDropStart(e.latlng);
      } else if (dropMode === "end") {
        onDropEnd(e.latlng);
      }
    },
  });
  return null;
};

const Map = ({ center, zoom = 13, geoJsonPath }: MapProps) => {
  const dropMode = useRouteStore((s) => s.dropMode);
  const { setRouteData } = useRouteStore((s) => s);

  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
  const [hoverPos, setHoverPos] = useState<L.LatLng | null>(null);

  const onEachFeature = (feature: any, layer: L.Layer) => {
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

      layer.on("mouseover", function (this: L.Layer) {
        this.openTooltip();
      });
      layer.on("mouseout", function (this: L.Layer) {
        this.closeTooltip();
      });
    }
  };

  const style = (feature: any) => ({
    color: feature.properties.stroke || "#1b1c1c",
    weight: 3,
    opacity: 1,
    interactive: true,
  });

  const pointToLayer = (feature: any, latlng: L.LatLng) =>
    L.circleMarker(latlng, {
      radius: 8,
      weight: 2,
      opacity: 1,
      fillOpacity: 1,
    });

  // useEffect to call the API whenever startPoint or endPoint changes
  useEffect(() => {
    // Call API when either marker is placed
    const fetchRouteData = async () => {
      if (startPoint && endPoint) {
        const data = await getRouteData(
          {
            lat: startPoint.lat,
            lng: startPoint.lng,
          },
          {
            lat: endPoint.lat,
            lng: endPoint.lng,
          }
        );
        console.log("Route data:", data);
        setRouteData(data);
      }
    };

    fetchRouteData();
  }, [startPoint, endPoint]);

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

      {dropMode !== "none" && (
        <DropPinHandler
          dropMode={dropMode}
          onDropStart={setStartPoint}
          onDropEnd={setEndPoint}
        />
      )}

      {startPoint && <Marker position={startPoint} />}
      {endPoint && <Marker position={endPoint} />}

      {hoverPos &&
        dropMode !== "none" &&
        ((dropMode === "start" && !startPoint) ||
          (dropMode === "end" && !endPoint)) && (
          <Marker position={hoverPos} opacity={0.5} />
        )}
    </MapContainer>
  );
};

export default Map;
