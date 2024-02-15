import { MarkerService } from './../../services/marker.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, startWith } from 'rxjs';
import { SubSink } from 'subsink';
import { Boundary } from '../../models/Boundary';
import { EditModesEnum } from '../../models/EditModesEnum';
import { Path } from '../../models/Path';
import { PointOfInterest } from '../../models/PointOfInterest';
import { GoogleMapsService } from '../../services/google-maps.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-google-map-v2',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    animations: [
        trigger('fade', [
            transition('void => *', [
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 })),
            ]),
            transition('* => void', [animate(250, style({ opacity: 0 }))]),
        ]),
    ],
})
export class GoogleMapV2Component implements OnInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
    private subs = new SubSink();

    loading = false;
    title = 'map-tools';
    darkMode = true;
    expandedMapTools = false;
    mapForm: FormGroup;
    editMode: EditModesEnum | null = null;
    EditModesEnum = EditModesEnum;
    point: google.maps.LatLngLiteral = null;
    segments: google.maps.LatLngLiteral[] = [];
    color = '#E32831';

    zoom = 14;
    center: google.maps.LatLng;
    options: google.maps.MapOptions;
    infoWindowTitle = '';
    infoWindowContent = '';
    infoWindowOptions: google.maps.InfoWindowOptions;
    infoWindowOpenOptions: google.maps.InfoWindowOpenOptions;

    pointsOfInterest: PointOfInterest[] = [];
    paths: Path[] = [];
    boundaries: Boundary[] = [];

    pointOfInterestOptions: google.maps.MarkerOptions;
    pathOptions: google.maps.PolylineOptions;
    boundaryOptions: google.maps.PolygonOptions;
    linePointOptions: google.maps.MarkerOptions = {
        draggable: false,
        zIndex: 20,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: '#E32831',
        },
    };

    markerEdit: google.maps.Marker = null;

    icons = [
        {
            fontIcon: 'pets',
            fontFamily: 'Material Icons',
            class: 'material-icons',
        },
        {
            fontIcon: 'ev_charger',
            fontFamily: 'Material Symbols Outlined',
            class: 'material-symbols-outlined',
        },
        {
            fontIcon: 'local_parking',
            fontFamily: 'Material Icons',
            class: 'material-icons',
        },
        {
            fontIcon: 'camping',
            fontFamily: 'Material Symbols Outlined',
            class: 'material-symbols-outlined',
        },
        {
            fontIcon: 'hiking',
            fontFamily: 'Material Icons Outlined',
            class: 'material-icons-outlined',
        },
        {
            fontIcon: 'rowing',
            fontFamily: 'Material Icons Outlined',
            class: 'material-icons-outlined',
        },
    ];

    get selectedIcon() {
        return this.mapForm.get('icon')?.value;
    }

    get selectedColor() {
        return this.mapForm.get('iconColor')?.value;
    }

    constructor(
        private toaster: ToastrService,
        private mapService: GoogleMapsService,
        private markerService: MarkerService
    ) {
        this.options = mapService.DARK_MAP_OPTIONS;
        this.infoWindowOpenOptions = mapService.INFO_WINDOW_OPEN_OPTIONS;
        this.pointOfInterestOptions = mapService.MARKER_OPTIONS;
        this.pathOptions = mapService.POLYLINE_OPTIONS;
        this.boundaryOptions = mapService.POLYGON_OPTIONS;
    }

    ngOnInit(): void {
        this.toggleMode(null);
        this.getCurrentLocation();
    }

    toggleMapTools(): void {
        this.expandedMapTools = !this.expandedMapTools;
    }

    toggleDarkMode(): void {
        this.darkMode = !this.darkMode;
        if (this.darkMode) this.options = this.mapService.DARK_MAP_OPTIONS;
        else this.options = this.mapService.LIGHT_MAP_OPTIONS;
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
                    this.toaster.error(
                        "Couldn't get your location",
                        'Permission denied'
                    );
                } else if (error.POSITION_UNAVAILABLE) {
                    this.toaster.error(
                        "Couldn't get your location",
                        'Position unavailable'
                    );
                } else if (error.TIMEOUT) {
                    this.toaster.error(
                        "Couldn't get your location",
                        'Timed out'
                    );
                } else {
                    this.toaster.error(error.message, `Error: ${error.code}`);
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
                this.mapForm
                    .get('location')
                    .patchValue(JSON.stringify(this.point));
                if(!this.markerEdit) {
                    this.markerEdit = new google.maps.Marker(
                        this.markerService.setOptions(
                            this.map.googleMap,
                            this.point
                        )
                    );
                    this.markerEdit.addListener('dragend', (dragEvent: any) => {
                        this.point = dragEvent.latLng.toJSON();
                        this.mapForm
                            .get('location')
                            .patchValue(JSON.stringify(this.point));
                        this.markerEdit.setPosition(this.point);
                    });
                } else {
                    this.markerEdit.setPosition(this.point);
                }
                break;
            case EditModesEnum.LINE:
            case EditModesEnum.POLYGON:
                this.segments.push(event.latLng.toJSON());
                this.segments = JSON.parse(JSON.stringify(this.segments));
                this.mapForm
                    .get('segments')
                    .patchValue(JSON.stringify(this.segments));
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
            case EditModesEnum.LINE:
            case EditModesEnum.POLYGON:
                this.segments.splice(this.segments.length - 1);
                this.segments = JSON.parse(JSON.stringify(this.segments));
                this.mapForm
                    .get('segments')
                    .patchValue(JSON.stringify(this.segments));
                break;
        }
    }

    save() {
        if (this.mapForm.valid) {
            switch (this.editMode) {
                case EditModesEnum.MARKER: {
                    let pointsOfInterest: PointOfInterest[] =
                        JSON.parse(localStorage.getItem('pointsOfInterest')) ??
                        [];
                    const pointOfInterest: PointOfInterest = {
                        id: this.createSlug(
                            this.mapForm.get('displayName')?.value
                        ),
                        displayName: this.mapForm.get('displayName')?.value,
                        description: this.mapForm.get('description')?.value,
                        location: this.point,
                        iconColor: this.mapForm.get('iconColor')?.value,
                        infoWindowOptions: this.mapService.InfoWindowOptions(
                            this.point,
                            new google.maps.Size(0, -37)
                        ),
                        options: this.mapService.MarkerOptions({
                            color: this.mapForm.get('iconColor')?.value,
                            icon: this.mapForm.get('icon')?.value.fontIcon,
                            font: this.mapForm.get('icon')?.value.fontFamily,
                        }),
                    };
                    pointsOfInterest.push(pointOfInterest);
                    localStorage.setItem(
                        'pointsOfInterest',
                        JSON.stringify(pointsOfInterest)
                    );
                    break;
                }
                case EditModesEnum.POLYGON: {
                    let boundaries: Boundary[] =
                        JSON.parse(localStorage.getItem('boundaries')) ?? [];
                    const boundary: Boundary = {
                        id: this.createSlug(
                            this.mapForm.get('displayName')?.value
                        ),
                        displayName: this.mapForm.get('displayName')?.value,
                        description: this.mapForm.get('description')?.value,
                        segments: this.segments,
                        options: this.mapService.PolygonOptions(
                            this.mapForm.get('iconColor')?.value
                        ),
                        iconColor: this.mapForm.get('iconColor')?.value,
                        infoWindowOptions: this.mapService.InfoWindowOptions(
                            this.segments[Math.floor(this.segments.length / 2)],
                            new google.maps.Size(0, 0)
                        ),
                    };
                    boundaries.push(boundary);
                    localStorage.setItem(
                        'boundaries',
                        JSON.stringify(boundaries)
                    );
                    break;
                }
                case EditModesEnum.LINE: {
                    let paths: Path[] =
                        JSON.parse(localStorage.getItem('paths')) ?? [];
                    const path: Path = {
                        id: this.createSlug(
                            this.mapForm.get('displayName')?.value
                        ),
                        displayName: this.mapForm.get('displayName')?.value,
                        description: this.mapForm.get('description')?.value,
                        segments: this.segments,
                        options: this.mapService.PolylineOptions(
                            this.mapForm.get('iconColor')?.value
                        ),
                        iconColor: this.mapForm.get('iconColor')?.value,
                        infoWindowOptions: this.mapService.InfoWindowOptions(
                            this.segments[Math.floor(this.segments.length / 2)],
                            new google.maps.Size(0, 0)
                        ),
                    };
                    paths.push(path);
                    localStorage.setItem('paths', JSON.stringify(paths));
                    break;
                }
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

    clearAll() {
        localStorage.clear();
        this.pointsOfInterest = [];
        this.paths = [];
        this.boundaries = [];
        this.markerEdit?.setMap(null);
        this.markerEdit = null;
    }

    openInfoWindow(data: any, event?: any) {
        this.infoWindowTitle = data.displayName;
        this.infoWindowContent = data.description;
        this.infoWindowOptions =
            data.infoWindowOptions ?? this.mapService.INFO_WINDOW_OPTIONS;
        if (event) this.infoWindowOptions.position = event.latLng.toJSON();
        this.infoWindow.open();
    }

    closeInfoWindow() {
        this.infoWindow.close();
    }

    toggleMode(mode: EditModesEnum | null) {
        this.subs.unsubscribe();

        if (mode === null) {
            this.markerEdit?.setMap(null);
            this.markerEdit = null;
            this.getFromCache();
        }

        switch (mode) {
            case EditModesEnum.MARKER:
                this.initPointOfInterestForm();
                break;
            case EditModesEnum.POLYGON:
                this.markerEdit?.setMap(null);
                this.markerEdit = null;
                this.initBoundaryForm();
                break;
            case EditModesEnum.LINE:
                this.markerEdit?.setMap(null);
                this.markerEdit = null;
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
        this.pointsOfInterest =
            JSON.parse(localStorage.getItem('pointsOfInterest')) ?? [];
    }

    initPointOfInterestForm() {
        this.mapForm = new FormGroup({
            displayName: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            location: new FormControl(null),
            iconColor: new FormControl('#E32831', [Validators.required]),
            icon: new FormControl(null, [Validators.required]),
        });

        this.subs.sink = combineLatest([
            this.mapForm.get('iconColor').valueChanges.pipe(startWith(null)),
            this.mapForm.get('icon').valueChanges.pipe(startWith(null)),
        ]).subscribe(([iconColor, icon]) => {
            this.pointOfInterestOptions = this.mapService.MarkerOptions({
                color: iconColor,
                icon: icon?.fontIcon,
                font: icon?.fontFamily,
            });
            this.markerEdit?.setOptions(this.markerService.setIcon({
                color: iconColor,
                icon: icon?.fontIcon,
                font: icon?.fontFamily,
            }));
        });
    }

    initPathForm() {
        this.mapForm = new FormGroup({
            displayName: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            segments: new FormControl([]),
            iconColor: new FormControl('#E32831', [Validators.required]),
        });

        this.subs.sink = this.mapForm
            .get('iconColor')
            .valueChanges.pipe(startWith('#E32831'))
            .subscribe((iconColor) => {
                this.pathOptions = this.mapService.PolylineOptions(iconColor);
                this.linePointOptions = this.mapService.LinePointOptions({
                    color: iconColor,
                });
            });
    }

    initBoundaryForm() {
        this.mapForm = new FormGroup({
            displayName: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            segments: new FormControl([]),
            iconColor: new FormControl('#E32831', [Validators.required]),
        });

        this.subs.sink = this.mapForm
            .get('iconColor')
            .valueChanges.pipe(startWith('#E32831'))
            .subscribe((iconColor) => {
                this.boundaryOptions =
                    this.mapService.PolygonOptions(iconColor);
                this.linePointOptions = this.mapService.LinePointOptions({
                    color: iconColor,
                });
            });
    }

    colorChange(value: any) {
        this.color = value;
        this.mapForm.get('iconColor').patchValue(value);
    }

    onEditClick(event: any) {
        let match: any = this.pointsOfInterest.find(
            (p) => p.displayName === event
        );
        if (match) {
            this.toggleMode(EditModesEnum.MARKER);
            this.point = match.location;
            this.mapForm
                .get('location')
                .patchValue(JSON.stringify(match.location));
        } else {
            match = this.paths.find((p) => p.displayName === event);
            if (match) {
                this.toggleMode(EditModesEnum.LINE);
            } else {
                match = this.boundaries.find((p) => p.displayName === event);
                if (match) {
                    this.toggleMode(EditModesEnum.POLYGON);
                }
            }
            this.segments = match.segments;
            this.mapForm
                .get('segments')
                .patchValue(JSON.stringify(match.segments));
        }

        this.mapForm.get('displayName').patchValue(match.displayName);
        this.mapForm.get('description').patchValue(match.description);
        this.mapForm.get('iconColor').patchValue(match.iconColor);
        this.color = match.iconColor;
    }

    onDeleteClick(event: any) {
        let match: any = this.pointsOfInterest.findIndex(
            (p) => p.displayName === event
        );
        if (match >= 0) {
            this.pointsOfInterest.splice(match, 1);
            localStorage.setItem(
                'pointsOfInterest',
                JSON.stringify(this.pointsOfInterest)
            );
        } else {
            match = this.paths.findIndex((p) => p.displayName === event);
            if (match >= 0) {
                this.paths.splice(match, 1);
                localStorage.setItem('paths', JSON.stringify(this.paths));
            } else {
                match = this.boundaries.findIndex(
                    (p) => p.displayName === event
                );
                if (match >= 0) {
                    this.boundaries.splice(match, 1);
                    localStorage.setItem(
                        'boundaries',
                        JSON.stringify(this.boundaries)
                    );
                }
            }
        }
        this.infoWindow.close();
    }
}
