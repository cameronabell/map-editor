import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatesToStringPipe } from './coordinates-to-string.pipe';



@NgModule({
  declarations: [
    CoordinatesToStringPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CoordinatesToStringPipe
  ]
})
export class PipesModule { }
