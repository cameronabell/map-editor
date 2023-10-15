import { InfoWindow } from "./InfoWindow";

export interface Boundary extends InfoWindow {
  description?: string;
  displayName?: string|null;
  iconBackgroundColor?: string|null;
  iconColor?: string|null;
  iconURI?: string|null;
  id?: string|null;
  options?: google.maps.PolygonOptions|null;
  segments?: google.maps.LatLngLiteral[];
}
