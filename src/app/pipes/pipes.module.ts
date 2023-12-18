import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatesToStringPipe } from './coordinates-to-string.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';



@NgModule({
  declarations: [
    CoordinatesToStringPipe,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CoordinatesToStringPipe,
    SafeHtmlPipe
  ]
})
export class PipesModule { }
