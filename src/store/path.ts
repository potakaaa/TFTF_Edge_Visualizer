import { create } from "zustand";

type Coordinate = [number, number]; // [longitude, latitude]

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
    });
  },
}));
