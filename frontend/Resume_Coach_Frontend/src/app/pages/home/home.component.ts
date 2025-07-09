import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import {
  MatProgressSpinnerModule,
  MatSpinner,
} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedFile: File | null = null;
  jobDescription: string = '';
  jdFile: File | null = null;
  modelOptions: string[] = ['LLaMA-3', 'LLaMA-3-Instant', 'Gemma'];
  selectedModel: string = '';
  analysisSuccess = false;
  analysisStorageKey = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log('Selected file:', this.selectedFile.name);
    }
  }

  onJDTextChange(): void {
    if (this.jobDescription.trim().length > 0) {
      this.jdFile = null;
    }
  }

  onJDFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.jdFile = input.files[0];
      this.jobDescription = '';
    }
  }

  onSubmit(): void {
    this.loading = true;
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('resume', this.selectedFile, this.selectedFile.name);
    }
    if (this.jobDescription.trim()) {
      formData.append('jd_text', this.jobDescription.trim());
    } else if (this.jdFile) {
      formData.append('jd_file', this.jdFile, this.jdFile.name);
    }

    formData.append('model', this.selectedModel);

    this.http.post('http://localhost:8000/analyze', formData).subscribe({
      next: (res) => {
        console.log('Response', res);

        const timestamp = new Date().toISOString();
        const storageKey = `analysis_${timestamp}`;

        const analysisData = {
          ...res,
          timestamp,
          resumeName: this.selectedFile?.name || 'Unknown Resume',
          jdFileName: this.jdFile?.name || null,
          job_description: this.jobDescription.trim() || '',
        };

        localStorage.setItem(storageKey, JSON.stringify(analysisData));

        this.analysisSuccess = true;
        this.analysisStorageKey = storageKey;
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error');
        this.loading = false;
      },
    });
  }

  formValid(): boolean {
    const hasResume = !!this.selectedFile;
    const hasJD = !!this.jdFile || this.jobDescription.trim().length > 0;
    const hasModel = !!this.selectedModel;

    return hasResume && hasJD && hasModel;
  }
}
