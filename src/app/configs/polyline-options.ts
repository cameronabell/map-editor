export const POLYLINE_OPTIONS: google.maps.PolylineOptions = {
  strokeColor: 'grey',
  strokeOpacity: 1,
  strokeWeight: 5,
  clickable: true,
  draggable: false,
  editable: false,
  zIndex: 10,
}

export function PolylineOptions(strokeColor: string = 'grey'): google.maps.PolylineOptions {
  return  {
    strokeColor,
    strokeOpacity: 1,
    strokeWeight: 5,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 10,
  }
}
