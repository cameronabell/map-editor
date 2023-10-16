import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ColorPickerModule } from 'nxt-color-picker';
import { AppComponent } from './app.component';
import { EditModesEnum } from './models/EditModesEnum';
import { PipesModule } from './pipes/pipes.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        GoogleMapsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        ColorPickerModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        ToastrModule.forRoot()],
      providers: [ToastrService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  //#region DOM Interaction
  it('should update zoom level when calling zoomIn', () => {
    component.zoom = 10;
    component.options = { maxZoom: 15, minZoom: 5 }; // Adjust options based on your component
    component.zoomIn();
    expect(component.zoom).toBe(11);
  });
  //#endregion

  //#region Functions
  it('should calculate slug correctly', () => {
    const slug = component.createSlug('Test Display Name');
    expect(slug).toBe('test-display-name');
  });

  it('should toggle edit mode', () => {
    component.toggleMode(EditModesEnum.MARKER);
    expect(component.editMode).toBe(EditModesEnum.MARKER);
    // Add more tests for toggleMode with different modes
  });
  //#endregion
});
