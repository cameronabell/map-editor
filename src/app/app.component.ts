import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiLoaded: Observable<boolean>;

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyB2ADavRj7KVrD4aipoTtTzxtYHCaGdbQs', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }
}
