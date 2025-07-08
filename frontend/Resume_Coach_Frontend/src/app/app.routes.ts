import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  { path: 'analysis', component: AnalysisComponent },
];
