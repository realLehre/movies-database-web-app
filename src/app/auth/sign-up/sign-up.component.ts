import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewChecked {
  signUpForm!: FormGroup;
  show: boolean = false;
  showConfirm: boolean = false;
  tellPasswordHint: boolean = false;
  tellEmailHint: boolean = false;
  passwordMatch: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  posterUrl: string = '';

  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$'
        ),
      ]),
      confirmPassword: new FormControl('', Validators.required),
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

  ngAfterViewChecked(): void {}

  get name() {
    return this.signUpForm.controls['name'];
  }

  get email() {
    return this.signUpForm.controls['email'];
  }

  get password() {
    return this.signUpForm.controls['password'];
  }

  get confirmPassword() {
    return this.signUpForm.controls['confirmPassword'];
  }

  tell(type: string) {
    switch (type) {
      case 'password': {
        this.tellPasswordHint = true;
        break;
      }
      case 'email': {
        this.tellEmailHint = true;
        break;
      }
      default: {
        return;
      }
    }
  }

  onKey(event: any) {
    if (this.password.value === this.confirmPassword.value) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  onToggleVisibility(status: string) {
    if (status == 'password') {
      this.show = !this.show;
    } else {
      this.showConfirm = !this.showConfirm;
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signUp(
        this.name.value,
        this.email.value,
        this.password.value
      );
    }
  }

  onSignInWithGoogle() {
    this.authService.authWithGoogle();
  }
}
