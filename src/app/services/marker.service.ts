import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MarkerService {
    setOptions(
        map: google.maps.Map,
        position: google.maps.LatLng | google.maps.LatLngLiteral
    ): google.maps.MarkerOptions {
        return {
            position: position,
            map: map,
            draggable: true,
            zIndex: 20,
            icon: {
                path: 'M75.0224838,17.8977051c-13.3836021-13.383606-35.0827599-13.383606-48.4663086,0  c-12.9297485,12.9297485-13.3651123,33.6188354-1.3123169,47.0749512c0.1434937,0.1901245,0.2963867,0.3753662,0.4696045,0.548645  l21.4182148,21.4182129c2.0200806,2.0200195,5.295166,2.0200195,7.3152466-0.000061l21.4182701-21.4182129  c0.1732178-0.1732178,0.3260498-0.3585205,0.4695435-0.548645C88.3875351,51.5165405,87.9522324,30.8274536,75.0224838,17.8977051z   M50.7893333,64.1989136c-12.1732788,0-22.0416889-9.8683472-22.0416889-22.041626s9.8684101-22.041626,22.0416889-22.041626  c12.1732178,0,22.0416222,9.8683472,22.0416222,22.041626S62.9625511,64.1989136,50.7893333,64.1989136z',
                fillColor: '#E32831',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 0.6,
                labelOrigin: new google.maps.Point(50, 42),
                anchor: new google.maps.Point(50, 85),
            },
            label: {
                fontFamily: 'Material Icons Round',
                text: 'circle',
                fontSize: '20px',
                color: '#E32831',
            },
        };
    }

    setIcon(o: {
        color?: string;
        font?: string;
        icon?: string;
    }): google.maps.MarkerOptions {
        return {
            icon: {
                path: 'M75.0224838,17.8977051c-13.3836021-13.383606-35.0827599-13.383606-48.4663086,0  c-12.9297485,12.9297485-13.3651123,33.6188354-1.3123169,47.0749512c0.1434937,0.1901245,0.2963867,0.3753662,0.4696045,0.548645  l21.4182148,21.4182129c2.0200806,2.0200195,5.295166,2.0200195,7.3152466-0.000061l21.4182701-21.4182129  c0.1732178-0.1732178,0.3260498-0.3585205,0.4695435-0.548645C88.3875351,51.5165405,87.9522324,30.8274536,75.0224838,17.8977051z   M50.7893333,64.1989136c-12.1732788,0-22.0416889-9.8683472-22.0416889-22.041626s9.8684101-22.041626,22.0416889-22.041626  c12.1732178,0,22.0416222,9.8683472,22.0416222,22.041626S62.9625511,64.1989136,50.7893333,64.1989136z',
                fillColor: o.color ?? '#E32831',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 0.6,
                labelOrigin: new google.maps.Point(50, 42),
                anchor: new google.maps.Point(50, 85),
            },
            label: {
                fontFamily: o.font ?? 'Material Icons',
                text: o.icon ?? 'circle',
                fontSize: '20px',
                color: o.color ?? '#E32831',
            },
        };
    }

    setPosition(
        position: google.maps.LatLng | google.maps.LatLngLiteral
    ): google.maps.MarkerOptions {
        return {
            position,
        };
    }
}
