import { create } from "zustand";
import { FeatureCollection } from "geojson";

interface RouteStore {
  fare_list: number[];
  total_fare: number;
  distance: number[];
  total_distance: number;
  geojson: FeatureCollection;
  route_names: string[];
  setRouteData: (data: any) => void;
  dropMode: "none" | "start" | "end";
  setDropMode: (mode: "none" | "start" | "end") => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  fare_list: [],
  total_fare: 0,
  distance: [],
  total_distance: 0,
  geojson: {
    type: "FeatureCollection",
    features: [],
  },
  route_names: [],
  setRouteData: (data) => {
    set({
      fare_list: data.routes.map((route: any) => route.fare) ?? [],
      total_fare: data.total_fare ?? 0,
      distance: data.routes.map((route: any) => route.distance_km) ?? [],
      total_distance: data.routes.reduce(
        (acc: number, route: any) => acc + route.distance_km,
        0
      ),
      geojson: data.geojson ?? { type: "FeatureCollection", features: [] },
      route_names: data.routes.map((route: any) => route.name) ?? [],
    });
  },
  dropMode: "none",
  setDropMode: (mode) => {
    set({ dropMode: mode });
  },
}));
