import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedFile: File | null = null;
  jobDescription: string = '';
  jdFile: File | null = null;
  modelOptions: string[] = ['LLaMA-3', 'LLaMA2', 'Gemma'];
  selectedModel: string = '';

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
    console.log('--- SUBMITTING ---');

    console.log('Resume File:', this.selectedFile);

    if (this.jdFile) {
      console.log('JD File:', this.jdFile.name);
    } else {
      console.log('JD Text:', this.jobDescription);
    }

    console.log('Selected Model:', this.selectedModel);
  }

  formValid(): boolean {
    const hasResume = !!this.selectedFile;
    const hasJD = !!this.jdFile || this.jobDescription.trim().length > 0;
    const hasModel = !!this.selectedModel;

    return hasResume && hasJD && hasModel;
  }
}
