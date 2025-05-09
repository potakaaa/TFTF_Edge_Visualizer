import { create } from "zustand";
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";

type Coordinate = [number, number]; // [longitude, latitude]

interface GeoJSONFeature {
  geometry: {
    coordinates: [number, number, number][] | [number, number, number];
    type: "LineString" | "Point";
  };
  properties: {
    name?: string;
    route_id?: number;
    stroke?: string;
    "marker-color"?: string;
    "marker-size"?: string;
    "marker-symbol"?: string;
    point_type?: "start" | "end";
  };
  type: "Feature";
}

interface GeoJSONData {
  features: GeoJSONFeature[];
  type: "FeatureCollection";
}

interface RouteStore {
  from: {
    latitude: number;
    longitude: number;
    name: string;
  };
  to: {
    latitude: number;
    longitude: number;
    name: string;
  };
  transferRange: number;
  routes: {
    entry: Coordinate;
    exit: Coordinate;
    routeId: number;
    cost: number;
  }[];
  coordinates: Coordinate[];
  geoJSON: FeatureCollection;
  setRouteData: (data: any) => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  from: {
    latitude: 0,
    longitude: 0,
    name: "",
  },
  to: {
    latitude: 0,
    longitude: 0,
    name: "",
  },
  transferRange: 0,
  routes: [],
  coordinates: [],
  geoJSON: {
    type: "FeatureCollection",
    features: [],
  },
  setRouteData: (data) => {
    set({
      from: {
        latitude: data.From["Lattitude"] ?? 0,
        longitude: data.From.Longitude,
        name: data.From["Origin Name"],
      },
      to: {
        latitude: data.To.Lattitude,
        longitude: data.To.Longitude,
        name: data.To["Destination Name"],
      },
      transferRange: data["Transfer Range"],
      routes: data.Routes.map((route: any) => ({
        entry: route["Entry Coordinate"],
        exit: route["Exit Coordinate"],
        routeId: route["Route ID"],
        cost: route["Transfer Cost"],
      })),
      coordinates: data.Coordinates,
      geoJSON: data.GeoJSON,
    });
  },
}));
