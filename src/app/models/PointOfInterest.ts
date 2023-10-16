import { InfoWindow } from "./InfoWindow";

export interface PointOfInterest extends InfoWindow {
  addressComponents?: google.maps.places.AddressComponent[];
  adrFormatAddress?: string|null
  attributions?: google.maps.places.Attribution[];
  businessStatus?: google.maps.places.BusinessStatus|null;
  description?: string|null;
  displayName?: string|null;
  formattedAddress?: string|null;
  googleMapsURI?: string|null;
  hasCurbsidePickup?: boolean|null;
  hasDelivery?: boolean|null;
  hasDineIn?: boolean|null;
  hasTakeout?: boolean|null;
  hasWheelchairAccessibleEntrance?: boolean|null;
  iconBackgroundColor?: string|null;
  iconColor?: string|null;
  iconURI?: string|null;
  id?: string;
  internationalPhoneNumber?: string|null;
  isReservable?: boolean|null;
  location?: google.maps.LatLngLiteral|null;
  nationalPhoneNumber?: string|null;
  openingHours?: google.maps.places.OpeningHours|null;
  options?: google.maps.MarkerOptions|null;
  photos?: google.maps.places.Photo[];
  plusCode?: google.maps.places.PlusCode|null;
  priceLevel?: google.maps.places.PriceLevel|null;
  rating?: number|null;
  requestedLanguage?: string|null;
  requestedRegion?: string|null;
  reviews?: google.maps.places.Review[];
  servesBeer?: boolean|null;
  servesBreakfast?: boolean|null;
  servesBrunch?: boolean|null;
  servesDinner?: boolean|null;
  servesLunch?: boolean|null;
  servesVegetarianFood?: boolean|null;
  servesWine?: boolean|null;
  svgIconMaskURI?: string|null;
  types?: string[];
  userRatingCount?: number|null;
  utcOffsetMinutes?: number|null;
  viewport?: google.maps.LatLngBounds|null;
  websiteURI?: string|null;
}
