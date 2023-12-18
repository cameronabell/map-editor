import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  INFO_WINDOW_OPTIONS: google.maps.InfoWindowOptions = {
    disableAutoPan: false,
    maxWidth: 300,
    minWidth: 160,
    zIndex: 50
  }

  INFO_WINDOW_OPEN_OPTIONS: google.maps.InfoWindowOpenOptions = {
    shouldFocus: true
  }

  InfoWindowOptions(position?: google.maps.LatLng|google.maps.LatLngLiteral|null, pixelOffset?: google.maps.Size): google.maps.InfoWindowOptions {
    return {
      position,
      disableAutoPan: false,
      maxWidth: 300,
      minWidth: 160,
      zIndex: 50,
      pixelOffset
    }
  }

  MARKER_OPTIONS: google.maps.MarkerOptions = {
    draggable: false,
    zIndex: 20,
    icon: {
      path: "M75.0224838,17.8977051c-13.3836021-13.383606-35.0827599-13.383606-48.4663086,0  c-12.9297485,12.9297485-13.3651123,33.6188354-1.3123169,47.0749512c0.1434937,0.1901245,0.2963867,0.3753662,0.4696045,0.548645  l21.4182148,21.4182129c2.0200806,2.0200195,5.295166,2.0200195,7.3152466-0.000061l21.4182701-21.4182129  c0.1732178-0.1732178,0.3260498-0.3585205,0.4695435-0.548645C88.3875351,51.5165405,87.9522324,30.8274536,75.0224838,17.8977051z   M50.7893333,64.1989136c-12.1732788,0-22.0416889-9.8683472-22.0416889-22.041626s9.8684101-22.041626,22.0416889-22.041626  c12.1732178,0,22.0416222,9.8683472,22.0416222,22.041626S62.9625511,64.1989136,50.7893333,64.1989136z",
      fillColor: '#E32831',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 0.6,
      labelOrigin: new google.maps.Point(50,42),
      anchor: new google.maps.Point(50,85)
    },
    label: {
      fontFamily: 'Material Icons Round',
      text: "circle",
      fontSize: "20px",
      color: '#E32831'
    }
  }

  LinePointOptions(options: {color?: string}): google.maps.MarkerOptions {
    return {
      draggable: false,
      zIndex: 20,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: options.color ?? '#E32831',
      }
    }
  }

  MarkerOptions(options: {
    color?: string,
    icon?: string,
    font?: string
  }): google.maps.MarkerOptions {

    return  {
      draggable: false,
      zIndex: 20,
      icon: {
        path: "M75.0224838,17.8977051c-13.3836021-13.383606-35.0827599-13.383606-48.4663086,0  c-12.9297485,12.9297485-13.3651123,33.6188354-1.3123169,47.0749512c0.1434937,0.1901245,0.2963867,0.3753662,0.4696045,0.548645  l21.4182148,21.4182129c2.0200806,2.0200195,5.295166,2.0200195,7.3152466-0.000061l21.4182701-21.4182129  c0.1732178-0.1732178,0.3260498-0.3585205,0.4695435-0.548645C88.3875351,51.5165405,87.9522324,30.8274536,75.0224838,17.8977051z   M50.7893333,64.1989136c-12.1732788,0-22.0416889-9.8683472-22.0416889-22.041626s9.8684101-22.041626,22.0416889-22.041626  c12.1732178,0,22.0416222,9.8683472,22.0416222,22.041626S62.9625511,64.1989136,50.7893333,64.1989136z",
        fillColor: options.color ?? '#E32831',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.6,
        labelOrigin: new google.maps.Point(50,42),
        anchor: new google.maps.Point(50,85)
      },
      label: {
        fontFamily: options.font ?? 'Material Icons',
        text: options.icon ?? 'circle',
        fontSize: "20px",
        color: options.color ?? '#E32831'
      }
    }
  }

  POLYGON_OPTIONS: google.maps.PolygonOptions = {
    strokeColor: 'grey',
    strokeOpacity: 1,
    strokeWeight: 5,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1,
  }

  PolygonOptions(strokeColor: string = 'grey'): google.maps.PolygonOptions {
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

  POLYLINE_OPTIONS: google.maps.PolylineOptions = {
    strokeColor: 'grey',
    strokeOpacity: 1,
    strokeWeight: 5,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 10,
  }

  PolylineOptions(strokeColor: string = 'grey'): google.maps.PolylineOptions {
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

  MAP_OPTIONS: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#f2f0e6"
          }
        ]
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#5f6855"
          }
        ]
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#f5f1e6"
          }
        ]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#c9b2a6"
          }
        ]
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#dcd2be"
          }
        ]
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#ae9e90"
          }
        ]
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "on"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#ebebea"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#717d69"
          }
        ]
      },
      {
        featureType: "poi.business",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#d5e7c8"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#447530"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#fdfcf8"
          },
          {
            weight: 0.5
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#717d69"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {
            color: "#f7e599"
          },
          {
            weight: 2
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#e9bc62"
          },
          {
            weight: 1.5
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#f7e79c"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            weight: 3
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#e9bc62"
          },
          {
            weight: 1.5
          }
        ]
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [
          {
            color: "#f2d14a"
          }
        ]
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#d6ba39"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#dad7cf"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#8f7d77"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ebe3cd"
          }
        ]
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#ebebea"
          }
        ]
      },
      {
        featureType: "transit.station.airport",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#dad7cf"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#83c9dc"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#ffffff"
          }
        ]
      }
    ]
  }
}
