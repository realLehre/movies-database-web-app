import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewChecked {
  signUpForm!: FormGroup;
  show: boolean = false;
  showConfirm: boolean = false;
  passwordMatch: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          // Validators.pattern(
          //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[#$^+=!*()@%&]).{6,10}$'
          // ),
        ])
      ),
      confirmPassword: new FormControl(''),
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

  onKey(event: any) {
    if (this.password.value == this.confirmPassword.value) {
      this.passwordMatch = true;
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
    console.log(this.signUpForm);
    this.authService.signUp(
      this.name.value,
      this.email.value,
      this.password.value
    );
  }

  onSignInWithGoogle() {
    this.authService.authWithGoogle();
  }
}
