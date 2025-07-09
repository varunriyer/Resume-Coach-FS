import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AnalysisEntry {
  resumeName: string;
  jdSource: string;
  matchPercentage: number;
  storageKey: string;
}
@Component({
  selector: 'app-analysis',
  imports: [CommonModule],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css',
})
export class AnalysisComponent implements OnInit {
  analysisHistory: AnalysisEntry[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('analysis_')
    );

    this.analysisHistory = keys.map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || '{}');

      const jdText =
        data.job_description?.length > 0
          ? `${data.job_description.slice(0, 40)}...`
          : data.jdFileName || 'JD';

      return {
        resumeName: data.resumeName || 'Unknown',
        jdSource: jdText,
        matchPercentage: data.feedback?.match_percentage || 0,
        storageKey: key,
      };
    });
  }

  viewAnalysis(key: string): void {
    this.router.navigate(['/home/analysis'], { queryParams: { key } });
  }
}
