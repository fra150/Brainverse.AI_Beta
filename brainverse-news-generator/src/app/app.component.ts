import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { HomeComponent } from "./pages/home/home.component";
import { NavigationService } from './services/services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'brainverse-news-generator';
  currentUrl = '';
  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.getCurrentUrl().subscribe(url => {
      this.currentUrl = url;
    });
  }
}
