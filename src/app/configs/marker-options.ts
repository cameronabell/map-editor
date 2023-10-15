export const MARKER_OPTIONS: google.maps.MarkerOptions = {
  draggable: false,
  zIndex: 20,
  animation: google.maps.Animation.DROP
}

export function MarkerOptions(hasAnimation: boolean): google.maps.MarkerOptions {
  return  {
    draggable: false,
    zIndex: 20,
    animation: google.maps.Animation.DROP
  }
}
