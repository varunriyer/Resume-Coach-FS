import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalysisDetailComponent } from './pages/analysis-detail/analysis-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'analysis/view', component: AnalysisDetailComponent },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
