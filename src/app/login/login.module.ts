import { NgModule } from '@angular/core';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from "angular-6-social-login";
import { LoginRoutingModule, routedComponents } from './login-routing.module';
import { SharedModule } from '../shared/shared.module';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("278715863793-qfvs6r27699liejsi00t73mnb873glds.apps.googleusercontent.com")
        }
      ]
  );
  return config;
}

@NgModule({
  imports: [LoginRoutingModule, SharedModule, SocialLoginModule],
  declarations: [routedComponents],
  providers: [    {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }]
})
export class LoginModule {}
