import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-analysis-detail',
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './analysis-detail.component.html',
  styleUrl: './analysis-detail.component.css',
})
export class AnalysisDetailComponent implements OnInit {
  analysisData: any = null;
  jdSource: string = 'JD';
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const key = params['key'];
      if (key) {
        const data = localStorage.getItem(key);
        if (data) {
          this.analysisData = JSON.parse(data);
        } else {
          this.router.navigate(['home/analysis']);
        }
      } else {
        this.router.navigate(['home/analysis']);
      }
    });
    console.log(this.analysisData);

    this.jdSource =
      this.analysisData.job_description &&
      this.analysisData.job_description.length > 0
        ? this.analysisData.job_description
        : this.analysisData.jdFileName || 'JD';
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-green';
    if (score >= 50) return 'score-yellow';
    return 'score-red';
  }
}
