import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../services/services/http.service';
import { OutputComponent } from "../output/output.component";
import { LoadingService } from '../../services/services/loading.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OutputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  featureForm!: FormGroup;
  contentType: string = '';
  socialMediaType: string = '';

  articles: any[] = [];
  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(private fb: FormBuilder, private httpService: HttpService, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.initializeForm();
    // Subscribe to loading state from LoadingService
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  // Initialize form with controls
  initializeForm(): void {
    this.featureForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]],
      contentType: [null, Validators.required],
      socialMedia: [null, Validators.required],
    });
  }

  // Handle content type selection
  toggleContentType(type: string): void {
    this.contentType = type;
    this.featureForm.patchValue({ contentType: type });
  }

  // Handle social media type selection
  toggleSocialMediaType(type: string): void {
    this.socialMediaType = type;
    this.featureForm.patchValue({ socialMedia: type });
  }

  // Submit form data
  onSubmit(event: Event): void {

    event.preventDefault(); // Prevent default form submission behavior

    if (this.featureForm.valid) {
      const formData = this.featureForm.value;
      console.log('Form submitted:', formData);
      // Handle form submission logic here

      this.loadingService.start();
      this.httpService.postData("generate-content", formData).subscribe({
        next: (response) => {
          this.articles = response.articles;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching content:', error);
          this.isLoading = false;
          this.hasError = true;
        },
      });
      // this.loadingService.stop();


    } else {
      console.log('Form is invalid');
    }
  }

}
