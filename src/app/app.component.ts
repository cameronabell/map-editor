import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink';
import { InfoWindowOptions, INFO_WINDOW_OPEN_OPTIONS, INFO_WINDOW_OPTIONS } from './configs/info-window-options';
import { MAP_OPTIONS } from './configs/map-options';
import { MARKER_OPTIONS } from './configs/marker-options';
import { PolygonOptions, POLYGON_OPTIONS } from './configs/polygon-options';
import { PolylineOptions, POLYLINE_OPTIONS } from './configs/polyline-options';
import { Boundary } from './models/Boundary';
import { EditModesEnum } from './models/EditModesEnum';
import { Path } from './models/Path';
import { PointOfInterest } from './models/PointOfInterest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  private subs = new SubSink();

  loading = false;
  title = 'map-tools';
  mapForm: FormGroup;
  editMode: EditModesEnum | null = null;
  EditModesEnum = EditModesEnum;
  point: google.maps.LatLngLiteral = null;
  segments: google.maps.LatLngLiteral[] = [];
  color = "#000"

  zoom = 14;
  center: google.maps.LatLng;
  options: google.maps.MapOptions = MAP_OPTIONS;
  infoWindowTitle = '';
  infoWindowContent = '';
  infoWindowOptions: google.maps.InfoWindowOptions;
  infoWindowOpenOptions: google.maps.InfoWindowOpenOptions = INFO_WINDOW_OPEN_OPTIONS;

  pointsOfInterest: PointOfInterest[] = [];
  paths: Path[] = [];
  boundaries: Boundary[] = [];

  pointOfInterestOptions: google.maps.MarkerOptions = MARKER_OPTIONS;
  pathOptions: google.maps.PolylineOptions = POLYLINE_OPTIONS;
  boundaryOptions: google.maps.PolygonOptions = POLYGON_OPTIONS;
  linePointOptions: google.maps.MarkerOptions = {
    draggable: false,
    zIndex: 20,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4,
      fillColor: '#000',
    }
  };

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.toggleMode(null);
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    this.loading = true;

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.loading = false;

        const point: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.center = new google.maps.LatLng(point); //{ lat: 38.084976, lng: -85.767326 }
        this.map.panTo(point);
      },
      (error) => {
        this.loading = false;

        if (error.PERMISSION_DENIED) {
          this.toastr.error("Couldn't get your location", 'Permission denied');
        } else if (error.POSITION_UNAVAILABLE) {
          this.toastr.error(
            "Couldn't get your location",
            'Position unavailable'
          );
        } else if (error.TIMEOUT) {
          this.toastr.error("Couldn't get your location", 'Timed out');
        } else {
          this.toastr.error(error.message, `Error: ${error.code}`);
        }
      },
      { enableHighAccuracy: true }
    );
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
        this.point = event.latLng.toJSON();
        this.mapForm.get('location').patchValue(JSON.stringify(this.point));
        break;
      case EditModesEnum.LINE:
        this.segments.push(event.latLng.toJSON());
        this.segments = JSON.parse(JSON.stringify(this.segments));
        this.mapForm.get('segments').patchValue(JSON.stringify(this.segments));
        break;
      case EditModesEnum.POLYGON:
        this.segments.push(event.latLng.toJSON());
        this.segments = JSON.parse(JSON.stringify(this.segments));
        this.mapForm.get('segments').patchValue(JSON.stringify(this.segments));
        break;
    }
  }

  dragged(event: google.maps.PolyMouseEvent) {
    console.log(event);
  }

  undo() {
    switch (this.editMode) {
      case EditModesEnum.MARKER:
        this.point = null;
        this.mapForm.get('location').reset();
        break;
      case EditModesEnum.POLYGON:
      case EditModesEnum.LINE:
        this.segments.splice(this.segments.length - 1);
        this.segments = JSON.parse(JSON.stringify(this.segments));
        this.mapForm.get('segments').patchValue(JSON.stringify(this.segments));
        break;
    }
  }

  save() {
    if (this.mapForm.valid) {
      switch (this.editMode) {
        case EditModesEnum.MARKER:
          let pointsOfInterest: PointOfInterest[] = JSON.parse(localStorage.getItem('pointsOfInterest')) ?? [];
          const pointOfInterest: PointOfInterest = {
            id: this.createSlug(this.mapForm.get('displayName')?.value),
            displayName: this.mapForm.get('displayName')?.value,
            description: this.mapForm.get('description')?.value,
            location: this.point,
            iconColor: this.mapForm.get('iconColor')?.value,
            infoWindowOptions: InfoWindowOptions(this.point, new google.maps.Size(0, -37))
          }
          pointsOfInterest.push(pointOfInterest);
          localStorage.setItem('pointsOfInterest', JSON.stringify(pointsOfInterest));
          break;
        case EditModesEnum.POLYGON:
          let boundaries: Boundary[] = JSON.parse(localStorage.getItem('boundaries')) ?? [];
          const boundary: Boundary = {
            id: this.createSlug(this.mapForm.get('displayName')?.value),
            displayName: this.mapForm.get('displayName')?.value,
            description: this.mapForm.get('description')?.value,
            segments: this.segments,
            options: PolygonOptions(this.mapForm.get('iconColor')?.value),
            iconColor: this.mapForm.get('iconColor')?.value,
            infoWindowOptions: InfoWindowOptions(this.segments[Math.floor(this.segments.length / 2)], new google.maps.Size(0, 0))
          }
          boundaries.push(boundary);
          localStorage.setItem('boundaries', JSON.stringify(boundaries));
          break;
        case EditModesEnum.LINE:
          let paths: Path[] = JSON.parse(localStorage.getItem('paths')) ?? [];
          const path: Path = {
            id: this.createSlug(this.mapForm.get('displayName')?.value),
            displayName: this.mapForm.get('displayName')?.value,
            description: this.mapForm.get('description')?.value,
            segments: this.segments,
            options: PolylineOptions(this.mapForm.get('iconColor')?.value),
            iconColor: this.mapForm.get('iconColor')?.value,
            infoWindowOptions: InfoWindowOptions(this.segments[Math.floor(this.segments.length / 2)], new google.maps.Size(0, 0))
          }
          paths.push(path);
          localStorage.setItem('paths', JSON.stringify(paths));
          break;
      }
      this.toggleMode(null);
    }
  }

  createSlug(str: string): string {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  delete() {
    localStorage.clear();
    this.pointsOfInterest = [];
    this.paths = [];
    this.boundaries = [];
  }

  openInfoWindow(data: any, event?: any) {
    this.infoWindowTitle = data.displayName;
    this.infoWindowContent = data.description;
    this.infoWindowOptions = data.infoWindowOptions ?? INFO_WINDOW_OPTIONS;
    if (event) this.infoWindowOptions.position = event.latLng.toJSON();
    this.infoWindow.open();
  }

  toggleMode(mode: EditModesEnum | null) {
    this.subs.unsubscribe();

    if (mode === null) {
      this.getFromCache();
    }

    switch (mode) {
      case EditModesEnum.MARKER:
        this.initPointOfInterestForm();
        break;
      case EditModesEnum.POLYGON:
        this.initBoundaryForm();
        break;
      case EditModesEnum.LINE:
        this.initPathForm();
        break;
    }

    this.point = null;
    this.segments = [];
    this.editMode = mode;
  }

  getFromCache() {
    this.paths = JSON.parse(localStorage.getItem('paths')) ?? [];
    this.boundaries = JSON.parse(localStorage.getItem('boundaries')) ?? [];
    this.pointsOfInterest = JSON.parse(localStorage.getItem('pointsOfInterest')) ?? [];
  }

  initPointOfInterestForm() {
    this.mapForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      location: new FormControl(null),
      iconColor: new FormControl('', [Validators.required]),
    });
  }

  initPathForm() {
    this.mapForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      segments: new FormControl([]),
      iconColor: new FormControl('', [Validators.required]),
    });
  }

  initBoundaryForm() {
    this.mapForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      segments: new FormControl([]),
      iconColor: new FormControl('', [Validators.required]),
    });
  }

  colorChange(value: any) {
    this.color = value;
    this.mapForm.get('iconColor').patchValue(value);
  }

  onEditClick(event: any) {
    let match: any = this.pointsOfInterest.find(p => p.displayName === event);
    if (match) {
      this.toggleMode(EditModesEnum.MARKER);
      this.point = match.location;
      this.mapForm.get('location').patchValue(JSON.stringify(match.location));
    } else {
      match = this.paths.find(p => p.displayName === event);
      if (match) {
        this.toggleMode(EditModesEnum.LINE);
      } else {
        match = this.boundaries.find(p => p.displayName === event);
        if (match) {
          this.toggleMode(EditModesEnum.POLYGON);
        }
      }
      this.segments = match.segments;
      this.mapForm.get('segments').patchValue(JSON.stringify(match.segments));
    }

    this.mapForm.get('displayName').patchValue(match.displayName);
    this.mapForm.get('description').patchValue(match.description);
    this.mapForm.get('iconColor').patchValue(match.iconColor);
    this.color = match.iconColor;
  }

  onDeleteClick(event: any) {
    let match: any = this.pointsOfInterest.findIndex(p => p.displayName === event);
    if (match >= 0) {
      this.pointsOfInterest.splice(match, 1);
      localStorage.setItem('pointsOfInterest', JSON.stringify(this.pointsOfInterest));
    } else {
      match = this.paths.findIndex(p => p.displayName === event);
      if (match >= 0) {
        this.paths.splice(match, 1);
        localStorage.setItem('paths', JSON.stringify(this.paths));
      } else {
        match = this.boundaries.findIndex(p => p.displayName === event);
        if (match >= 0) {
          this.boundaries.splice(match, 1);
          localStorage.setItem('boundaries', JSON.stringify(this.boundaries));
        }
      }
    }
    this.infoWindow.close();
  }
}
