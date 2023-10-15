export const INFO_WINDOW_OPTIONS: google.maps.InfoWindowOptions = {
  disableAutoPan: false,
  maxWidth: 300,
  minWidth: 160,
  zIndex: 50
}

export function InfoWindowOptions(position?: google.maps.LatLng|google.maps.LatLngLiteral|null, pixelOffset?: google.maps.Size): google.maps.InfoWindowOptions {
  return {
    position,
    disableAutoPan: false,
    maxWidth: 300,
    minWidth: 160,
    zIndex: 50,
    pixelOffset
  }
}

export const INFO_WINDOW_OPEN_OPTIONS: google.maps.InfoWindowOpenOptions = {
  shouldFocus: true
}
