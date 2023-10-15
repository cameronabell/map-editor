export interface Location {
  name: string;
  description: string;
  category: string;
  activities: string[];
  suitability: string[];
  attractions: string[];
  tags: string[];
  latLng: google.maps.LatLngLiteral;
  address: string;
  city: string;
  state: string;
  zip: string;
  iconClass: string;
}
