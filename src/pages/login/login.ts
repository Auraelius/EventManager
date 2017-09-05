import { Component } from '@angular/core';
import {
  IonicPage, 
  Loading,
  LoadingController, 
  NavController,
  Alert,
  AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm:FormGroup;
  public loading:Loading;

  constructor(public navCtrl:NavController, public loadingCtrl:LoadingController,
    public alertCtrl:AlertController, public authProvider:AuthProvider, 
    formBuilder:FormBuilder) {

      // initialize the form See https://javebratt.com/validate-forms-ionic-firebase/ and https://angular.io/api/forms/FormBuilder

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });
  }

  // Our login function just takes the value of the form fields and pass them to our loginUser function inside our AuthProvider service. It is also calling Ionic’s loading component since the app needs to communicate with the server to log the user in there might be a small delay in sending the user to the HomePage so we are using a loading component to give a visual so the user can understand that it is loading

  loginUser():void {
    if(!this.loginForm.valid){
      console.log(`Form isn't valid yet, current value: ${this.loginForm.value}`);
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      
      this.authProvider.loginUser(email, password).then( authData => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(HomePage);
        });
      }, error => {
        this.loading.dismiss().then( () => {
          const alert:Alert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: 'cancel'}]
          });
          alert.present()
        });
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present()
    }
  }

  goToSignup():void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword():void {
    this.navCtrl.push('ResetPasswordPage');
  }

}