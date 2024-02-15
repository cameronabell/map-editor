import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapV2Component } from './google-map.component';

describe('GoogleMapComponent', () => {
    let component: GoogleMapV2Component;
    let fixture: ComponentFixture<GoogleMapV2Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GoogleMapV2Component],
        }).compileComponents();

        fixture = TestBed.createComponent(GoogleMapV2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
