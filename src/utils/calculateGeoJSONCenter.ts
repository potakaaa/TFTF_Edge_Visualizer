export function calculateGeoJSONCenter(geojson: any): [number, number] {
  if (!geojson || !geojson.features || geojson.features.length === 0) {
    return [8.4542, 124.6319]; // fallback center
  }

  let minLat = Infinity,
    minLng = Infinity;
  let maxLat = -Infinity,
    maxLng = -Infinity;

  geojson.features.forEach((feature: any) => {
    const { type, coordinates } = feature.geometry;

    let points: [number, number][] = [];

    switch (type) {
      case "Point":
        if (Array.isArray(coordinates) && coordinates.length >= 2) {
          points.push([coordinates[0], coordinates[1]]);
        }
        break;

      case "MultiPoint":
      case "LineString":
        coordinates.forEach((pt: any) => {
          if (Array.isArray(pt) && pt.length >= 2) {
            points.push([pt[0], pt[1]]);
          }
        });
        break;

      case "MultiLineString":
      case "Polygon":
        coordinates.flat().forEach((pt: any) => {
          if (Array.isArray(pt) && pt.length >= 2) {
            points.push([pt[0], pt[1]]);
          }
        });
        break;

      case "MultiPolygon":
        coordinates.flat(2).forEach((pt: any) => {
          if (Array.isArray(pt) && pt.length >= 2) {
            points.push([pt[0], pt[1]]);
          }
        });
        break;

      default:
        console.warn("Unsupported geometry type:", type);
    }

    // Update bounds with valid points
    points.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
  });

  // If bounds are still infinity, fallback
  if (
    minLat === Infinity ||
    maxLat === -Infinity ||
    minLng === Infinity ||
    maxLng === -Infinity
  ) {
    return [8.4542, 124.6319];
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return [centerLat, centerLng];
}
