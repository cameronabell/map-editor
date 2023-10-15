import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { Observable, catchError, map, of } from 'rxjs';
import { SubSink } from 'subsink';
import { MAP_OPTIONS } from './configs/map-options';
import { Boundary } from './models/Boundary';
import { EditModesEnum } from './models/EditModesEnum';
import { Location } from './models/Location';
import { Path } from './models/Path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  title = 'map-tools';
  apiLoaded: Observable<boolean>;
  editMode: EditModesEnum | null = null;
  EditModesEnum = EditModesEnum;
  zoom = 14;
  center: google.maps.LatLngLiteral = { lat: 38.084976, lng: -85.767326 };
  options: google.maps.MapOptions = MAP_OPTIONS;
  polylineOptions = {
    strokeColor: 'grey',
    strokeOpacity: 1,
    strokeWeight: 5,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 10,
  };
  boundaryOptions = {
    strokeColor: 'grey',
    strokeOpacity: 1,
    strokeWeight: 5,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    zIndex: 20,
    animation: google.maps.Animation.DROP
  };

  linePointOptions: google.maps.MarkerOptions = {
    draggable: false,
    zIndex: 20,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4,
      fillColor: '#000',
    }
  };
  linePoints: google.maps.LatLngLiteral[] = [];
  paths: Path[] = [];
  locations: Location[] = [];
  boundaries: Boundary[] = [];

  marker: google.maps.LatLngLiteral = null;
  line: google.maps.LatLngLiteral[] = [];
  polygon: google.maps.LatLngLiteral[] = [];
  color = "#000"

  mapForm: FormGroup;
  categoryOptions: string[] = [
    'Horine Reservation',
    'Tom Wallace',
    'Paul Yost',
    'Scott\'s Gap'
  ];
  activityOptions: string[] = [
    'Walking',
    'Cycling',
    'Running',
    'Swimming',
    'Hiking',
  ];
  suitabilityOptions: string[] = [
    'Dog Friendly',
    'Kid Friendly',
    'Wheelchair Friendly',
    'Stroller Friendly',
    'Paved',
    'Partially Paved',
  ];
  attractionOptions: string[] = [
    'Waterfall',
    'Views',
    'Lake',
    'River',
    'Forest',
    'Beach',
    'Hot springs',
    'Wildflowers',
    'Wildlife',
    'Cave',
    'Historic site',
    'Rails trails',
    'City walk',
    'Event'
  ];
  difficultyOptions: string[] = [
    'Easy',
    'Moderate',
    'Hard'
  ];
  routeTypeOptions: string[] = [
    'Loop',
    'Out & back',
    'Point to point'
  ];
  stateOptions: string[] = [
    'Permanently Closed',
    'Temporarily Closed',
    'Partially Open',
    'Open',
    'Special'
  ];

  private subs = new SubSink();

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiLoaded = this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyB2ADavRj7KVrD4aipoTtTzxtYHCaGdbQs', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    this.toggleMode(null);
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--;
  }

  click(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    switch (this.editMode) {
      case EditModesEnum.MARKER:
        this.marker = event.latLng.toJSON();
        this.mapForm.get('latLng').patchValue(JSON.stringify(this.marker));
        break;
      case EditModesEnum.POLYGON:
        this.polygon.push(event.latLng.toJSON());
        this.polygon = JSON.parse(JSON.stringify(this.polygon));
        this.mapForm.get('path').patchValue(JSON.stringify(this.polygon));
        this.linePoints.push(this.polygon[this.polygon.length - 1]);
        break;
      case EditModesEnum.LINE:
        this.line.push(event.latLng.toJSON());
        this.line = JSON.parse(JSON.stringify(this.line));
        this.mapForm.get('path').patchValue(JSON.stringify(this.line));
        this.linePoints.push(this.line[this.line.length - 1]);
        break;
    }
  }

  dragged(event: google.maps.PolyMouseEvent) {
    console.log(event);
  }

  undo() {
    switch (this.editMode) {
      case EditModesEnum.MARKER:
        this.marker = null;
        this.mapForm.get('latLng').reset();
        break;
      case EditModesEnum.POLYGON:
        this.polygon.splice(this.polygon.length - 1);
        this.polygon = JSON.parse(JSON.stringify(this.polygon));
        this.mapForm.get('path').patchValue(JSON.stringify(this.polygon));
        this.linePoints.splice(this.linePoints.length - 1);
        this.linePoints = JSON.parse(JSON.stringify(this.linePoints));
        break;
      case EditModesEnum.LINE:
        this.line.splice(this.line.length - 1);
        this.line = JSON.parse(JSON.stringify(this.line));
        this.mapForm.get('path').patchValue(JSON.stringify(this.line));
        this.linePoints.splice(this.linePoints.length - 1);
        this.linePoints = JSON.parse(JSON.stringify(this.linePoints));
        break;
    }
  }

  save() {
    console.log(this.mapForm.valid)
    if (this.mapForm.valid) {
      switch (this.editMode) {
        case EditModesEnum.MARKER:
          let locations: Location[] = JSON.parse(localStorage.getItem('locations')) ?? [];
          const location: Location = {
            name: this.mapForm.get('name')?.value,
            description: this.mapForm.get('description')?.value,
            category: this.mapForm.get('category')?.value,
            activities: this.mapForm.get('activities')?.value,
            suitability: this.mapForm.get('suitability')?.value,
            attractions: this.mapForm.get('attractions')?.value,
            tags: this.mapForm.get('tags')?.value,
            latLng: this.marker,
            address: this.mapForm.get('address')?.value,
            city: this.mapForm.get('city')?.value,
            state: this.mapForm.get('state')?.value,
            zip: this.mapForm.get('zip')?.value,
            iconClass: this.mapForm.get('iconClass')?.value
          }
          locations.push(location);
          localStorage.setItem('locations', JSON.stringify(locations));
          break;
        case EditModesEnum.POLYGON:
          let boundaries: Boundary[] = JSON.parse(localStorage.getItem('boundaries')) ?? [];
          const boundary: Boundary = {
            name: this.mapForm.get('name')?.value,
            description: this.mapForm.get('description')?.value,
            category: this.mapForm.get('category')?.value,
            activities: this.mapForm.get('activities')?.value,
            suitability: this.mapForm.get('suitability')?.value,
            attractions: this.mapForm.get('attractions')?.value,
            tags: this.mapForm.get('tags')?.value,
            paths: this.polygon
          }
          boundaries.push(boundary);
          localStorage.setItem('boundaries', JSON.stringify(boundaries));
          break;
        case EditModesEnum.LINE:
          let paths: Path[] = JSON.parse(localStorage.getItem('paths')) ?? [];
          const path: Path = {
            name: this.mapForm.get('name')?.value,
            description: this.mapForm.get('description')?.value,
            category: this.mapForm.get('category')?.value,
            activities: this.mapForm.get('activities')?.value,
            suitability: this.mapForm.get('suitability')?.value,
            attractions: this.mapForm.get('attractions')?.value,
            tags: this.mapForm.get('tags')?.value,
            path: this.line,
            entryPoints: this.mapForm.get('entryPoints')?.value,
            difficulty: this.mapForm.get('difficulty')?.value,
            length: this.mapForm.get('length')?.value,
            elevationGain: this.mapForm.get('elevationGain')?.value,
            routeType: this.mapForm.get('routeType')?.value,
            state: this.mapForm.get('state')?.value,
            specialStateText: this.mapForm.get('specialStateText')?.value,
            iconClass: this.mapForm.get('iconClass')?.value,
          }
          paths.push(path);
          localStorage.setItem('paths', JSON.stringify(paths));
          break;
      }
      this.toggleMode(null);
    }
  }

  delete() {
    localStorage.clear();
  }

  openInfoWindowForPath(path: Path, event: any) {
    this.infoWindow.options = {
      content: `
        <h3>${path.name}</h3>
        <p>${path.description}</p>
      `,
      position: event.latLng,
      pixelOffset: null
    };
    this.infoWindow.open();
  }

  openInfoWindowForBoundary(boundary: Boundary, event: any) {
    this.infoWindow.options = {
      content: `
        <h3>${boundary.name}</h3>
        <p>${boundary.description}</p>
      `,
      position: event.latLng,
      pixelOffset: null
    };
    this.infoWindow.open();
  }

  openInfoWindowForLocation(location: Location) {
    this.infoWindow.options = {
      content: `
        <h3>${location.name}</h3>
        <p>${location.description}</p>
      `,
      position: location.latLng,
      pixelOffset: new google.maps.Size(0, -37)
    };
    this.infoWindow.open();
  }

  toggleMode(mode: EditModesEnum | null) {
    this.subs.unsubscribe();

    if (mode === null) {
      this.getFromCache();
    }

    switch (mode) {
      case EditModesEnum.MARKER:
        this.initLocationForm();
        break;
      case EditModesEnum.POLYGON:
        this.initBoundaryForm();
        break;
      case EditModesEnum.LINE:
        this.initPathForm();
        break;
    }

    this.marker = null;
    this.polygon = [];
    this.line = [];
    this.linePoints = [];
    this.editMode = mode;
  }

  getFromCache() {
    this.paths = JSON.parse(localStorage.getItem('paths')) ?? [];
    this.boundaries = JSON.parse(localStorage.getItem('boundaries')) ?? [];
    this.locations = JSON.parse(localStorage.getItem('locations')) ?? [];
  }

  initPathForm() {
    this.mapForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      activities: new FormControl([], [Validators.required]),
      suitability: new FormControl([], [Validators.required]),
      attractions: new FormControl([], [Validators.required]),
      tags: new FormControl([]),
      entryPoints: new FormControl('', [Validators.required]),
      difficulty: new FormControl('', [Validators.required]),
      length: new FormControl(0, [Validators.required]),
      elevationGain: new FormControl(0, [Validators.required]),
      routeType: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      specialStateText: new FormControl(''),
      iconClass: new FormControl(''),
      path: new FormControl([]),
    });
    this.subs.sink = this.mapForm.get('path').valueChanges.subscribe((value) => {
      console.log(value);
      this.line = JSON.parse(value);
      this.linePoints = this.line;
    });
  }

  initLocationForm() {
    this.mapForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      activities: new FormControl([], [Validators.required]),
      suitability: new FormControl([], [Validators.required]),
      attractions: new FormControl([], [Validators.required]),
      tags: new FormControl([]),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(0),
      zip: new FormControl(0),
      iconClass: new FormControl(''),
      latLng: new FormControl(null)
    });
    this.subs.sink = this.mapForm.get('latLng').valueChanges.subscribe((value) => {
      this.marker = JSON.parse(value);
    });
  }

  initBoundaryForm() {
    this.mapForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      activities: new FormControl([], [Validators.required]),
      suitability: new FormControl([], [Validators.required]),
      attractions: new FormControl([], [Validators.required]),
      tags: new FormControl([]),
      path: new FormControl([]),
    });
    this.subs.sink = this.mapForm.get('path').valueChanges.subscribe((value) => {
      this.polygon = JSON.parse(value);
      this.linePoints = this.polygon;
    });
  }
}
