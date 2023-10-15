import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coordinatesToString'
})
export class CoordinatesToStringPipe implements PipeTransform {

  transform(coordinates: google.maps.LatLngLiteral): string {
    return JSON.stringify(coordinates);
  }

}
