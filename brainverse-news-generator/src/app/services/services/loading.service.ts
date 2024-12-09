import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Available throughout the app
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable(); // Expose as an observable for components to subscribe to

  /**
   * Show the loading GIF.
   */
  start(): void {
    this.loadingSubject.next(true);
  }

  /**
   * Hide the loading GIF.
   */
  stop(): void {
    this.loadingSubject.next(false);
  }
}
