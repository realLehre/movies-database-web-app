import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  show: boolean = false;
  massError: boolean = false;
  returnUrl!: string;
  isLoading: boolean = false;
  errorMessage: string = '';
  posterUrl: string = '';

  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl('', Validators.compose([Validators.required])),
    });

    this.authService.isLoading.subscribe((status) => {
      this.isLoading = status;
    });

    this.authService.errorMessage.subscribe((error) => {
      this.errorMessage = error;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    });

    this.httpService.getCurrentlyPlaying().subscribe((data) => {
      const random = Math.floor(Math.random() * 20);
      this.posterUrl = data.posters[random];
    });
  }

  get email() {
    return this.signInForm.controls['email'];
  }

  get password() {
    return this.signInForm.controls['password'];
  }

  onSignIn() {
    if (this.signInForm.valid) {
      this.authService.signIn(this.email.value, this.password.value);
    } else {
      this.massError = true;
      setTimeout(() => {
        this.massError = false;
      }, 3000);
    }
  }

  onSignInWithGoogle() {
    this.authService.authWithGoogle();
  }
}
