import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';

interface AnalysisEntry {
  resumeName: string;
  jdSource: string;
  matchPercentage: number;
  storageKey: string;
  date: string;
  timestamp: string;
}
@Component({
  selector: 'app-analysis',
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
  ],
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

    const history = keys
      .map((key) => {
        const data = JSON.parse(localStorage.getItem(key) || '{}');

        const jdText =
          data.job_description && data.job_description.length > 0
            ? data.job_description.length > 40
              ? `${data.job_description.slice(0, 40)}...`
              : data.job_description
            : data.jdFileName || 'JD';

        const rawDate = data.timestamp;
        const formattedDate = rawDate
          ? new Date(rawDate).toLocaleString()
          : 'Date Unknown';

        return {
          resumeName: data.resumeName || 'Unknown',
          jdSource: jdText,
          matchPercentage: data.feedback?.match_percentage || 0,
          storageKey: key,
          date: formattedDate,
          timestamp: rawDate || '',
        };
      })
      .filter((entry) => entry.timestamp)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    this.analysisHistory = history;
  }

  viewAnalysis(key: string): void {
    this.router.navigate(['/home/analysis/view'], { queryParams: { key } });
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-green';
    if (score >= 50) return 'score-yellow';
    return 'score-red';
  }
}
