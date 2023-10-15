export interface Boundary {
  name: string;
  description: string;
  category: string;
  activities: string[];
  suitability: string[];
  attractions: string[];
  tags: string[];
  paths: google.maps.LatLngLiteral[];
}
