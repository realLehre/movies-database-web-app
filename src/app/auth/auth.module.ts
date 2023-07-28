import { NgModule } from '@angular/core';

import { SignInComponent } from './sign-in/sign-in.component';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [SignInComponent, SignUpComponent],
  imports: [CommonModule, AuthRoutingModule],
  exports: [SignInComponent],
})
export class AuthModule {}
