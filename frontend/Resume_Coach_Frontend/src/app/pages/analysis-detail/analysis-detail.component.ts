import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-analysis-detail',
  imports: [],
  templateUrl: './analysis-detail.component.html',
  styleUrl: './analysis-detail.component.css',
})
export class AnalysisDetailComponent implements OnInit {
  analysisData: any = null;

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
  }
}
