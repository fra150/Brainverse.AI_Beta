import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  /**
   * Get the current route event.
   * @returns Observable which contains the current route.
   */
  getCurrentUrl(): Observable<string> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects)
    );
  }

  /**
   * Gets the Menu which is active on Navigation bar.
   */
  getCurrentActiveMenu(): string {
    let currentUrl = '';
    this.getCurrentUrl().subscribe(url => {
      currentUrl = url;
    });
    return currentUrl;
  }

  /**
   * Checks whether a nav bar link is active or not.
   * @param path of the route currently active
   */
  isNavLinkActive(path: string): boolean {
    let currentUrl = '';
    this.getCurrentUrl().subscribe(url => {
      currentUrl = url;
    });
    if (currentUrl == path) {
      return true;
    }
    return false;
  }

}