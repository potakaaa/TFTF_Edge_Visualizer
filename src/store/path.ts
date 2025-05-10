import { create } from "zustand";
import { FeatureCollection } from "geojson";

interface RouteStore {
  fare: number;
  geojson: FeatureCollection;
  route_names: string[];
  setRouteData: (data: any) => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  fare: 0,
  geojson: {
    type: "FeatureCollection",
    features: [],
  },
  route_names: [],
  setRouteData: (data) => {
    set({
      fare: data.fare ?? 0,
      geojson: data.geojson ?? { type: "FeatureCollection", features: [] },
      route_names: data.route_names ?? [],
    });
  },
}));
