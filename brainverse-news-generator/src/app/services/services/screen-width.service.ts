import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScreenWidthService {
  private widthSource = new BehaviorSubject<number>(this.getWindowWidth());
  public currentWidth$ = this.widthSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.updateWidth(this.getWindowWidth());

      // Listen to window resize event only in the browser
      fromEvent(window, 'resize').subscribe(() => {
        this.updateWidth(this.getWindowWidth());
      });
    }
  }

  private updateWidth(width: number): void {
    this.widthSource.next(width);
  }

  // Safely get window width if we are in the browser environment
  private getWindowWidth(): number {
    return isPlatformBrowser(this.platformId) ? window.innerWidth : 0;
  }
}
