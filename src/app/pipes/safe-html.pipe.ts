import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): unknown {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, 'text/html');
    return this.sanitizer.bypassSecurityTrustHtml(doc.body.outerHTML);
  }

}
