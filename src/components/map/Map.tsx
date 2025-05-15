import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Marker,
  useMap,
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

// Add CSS for route animation
const routeAnimationStyles = `
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  .animated-route {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }

  .animated-route-1 {
    animation: dash 2s linear forwards;
  }

  .animated-route-2 {
    animation: dash 2s linear forwards;
    animation-delay: 2s;
  }

  .animated-route-3 {
    animation: dash 2s linear forwards;
    animation-delay: 4s;
  }
`;

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

const RouteLabels = ({ geoJsonPath }: { geoJsonPath: FeatureCollection }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonPath) return;

    geoJsonPath.features.forEach((feature: any) => {
      if (
        feature.geometry.type === "LineString" &&
        feature.properties?.route_name
      ) {
        const coordinates = feature.geometry.coordinates;
        const midPoint = coordinates[Math.floor(coordinates.length / 2)];

        const labelMarker = L.marker([midPoint[1], midPoint[0]], {
          icon: L.divIcon({
            className: "route-label",
            html: `<div style="
              background: white;
              padding: 6px 16px;
              min-width: 80px;
              border-radius: 4px;
              border: 1px solid #ccc;
              font-size: 12px;
              max-width: 140px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              cursor: pointer;
            ">${feature.properties.route_name}</div>`,
            iconSize: [140, 32],
            iconAnchor: [70, 16],
          }),
          interactive: true,
        }).addTo(map);
        labelMarker.bindTooltip(feature.properties.route_name, {
          direction: "top",
          offset: L.point(0, -35),
          opacity: 0.95,
          permanent: false,
          sticky: true,
        });
      }
    });

    // Cleanup function to remove markers when component unmounts
    return () => {
      map.eachLayer((layer) => {
        if (
          layer instanceof L.Marker &&
          (layer as any).options.icon?.options?.className === "route-label"
        ) {
          map.removeLayer(layer);
        }
      });
    };
  }, [geoJsonPath, map]);

  return null;
};

const style = (feature: any) => {
  if (feature.geometry.type !== "LineString") {
    return {
      color: feature.properties.stroke || "#1b1c1c",
      weight: 3,
      opacity: 1,
      interactive: true,
    };
  }

  // Get the index of the feature in the GeoJSON
  const featureIndex = feature.properties?.index || 0;

  return {
    color: feature.properties.stroke || "#1b1c1c",
    weight: 3,
    opacity: 1,
    interactive: true,
    className: `animated-route animated-route-${featureIndex + 1}`,
  };
};

const Map = ({ center, zoom = 13, geoJsonPath }: MapProps) => {
  const dropMode = useRouteStore((s) => s.dropMode);
  const { setRouteData, fare } = useRouteStore((s) => s);

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

  // Add index to each feature before rendering
  const processedGeoJson = React.useMemo(() => {
    if (!geoJsonPath) return null;

    return {
      ...geoJsonPath,
      features: geoJsonPath.features.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          index,
        },
      })),
    };
  }, [geoJsonPath]);

  return (
    <>
      <h1>FARE: {fare}</h1>
      <style>{routeAnimationStyles}</style>
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

        {processedGeoJson && (
          <>
            <GeoJSON
              key={JSON.stringify(processedGeoJson)}
              data={processedGeoJson}
              style={style}
              onEachFeature={onEachFeature}
              pointToLayer={pointToLayer}
              coordsToLatLng={(coords) => L.latLng(coords[1], coords[0])}
            />
            <RouteLabels geoJsonPath={processedGeoJson} />
            <FitBoundsGeoJSON geoJson={processedGeoJson} />
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
    </>
  );
};

export default Map;
