import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: '**', component: ErrorComponent}
];
