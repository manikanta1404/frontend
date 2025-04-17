import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  selectedImage: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', Validators.required], // Add confirmpassword control
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      image: [null]
      //image: [null, Validators.required] Initialize image control with null
    });
  }

  onSubmit(): void {
  if (this.registerForm.valid) {
    const formData = new FormData();

    Object.keys(this.registerForm.value).forEach(key => {
      if (key === 'phone_number') {
        formData.append('phone_Number', this.registerForm.get(key)!.value);
      } else if (key !== 'image') {
        formData.append(key, this.registerForm.get(key)!.value);
      }
    });

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    const headers = new HttpHeaders();
    
    this.http.post<any>(`${environment.BASE_URL}/createuser`, formData, { headers }).subscribe(
      response => {
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigate(['/dashboard']);
        }
      },
      error => {
        console.error('Error:', error);
        this.errorMessage = 'Failed to register user. Please try again.';
       }
     );
   }
 }

  
  onFileChange(event: any): void {
  const file = event.target.files?.[0] || null;
  if (file) {
    this.selectedImage = file;
    // optional: display preview, etc.
  }
} 
}
