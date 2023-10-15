export const POLYGON_OPTIONS: google.maps.PolygonOptions = {
  strokeColor: 'grey',
  strokeOpacity: 1,
  strokeWeight: 5,
  clickable: true,
  draggable: false,
  editable: false,
  zIndex: 1,
}

export function PolygonOptions(strokeColor: string = 'grey'): google.maps.PolygonOptions {
  return  {
    strokeColor,
    strokeOpacity: 1,
    strokeWeight: 5,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1,
  }
}
