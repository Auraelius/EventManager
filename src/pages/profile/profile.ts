import { Component } from '@angular/core';
import { IonicPage, NavController, Alert, AlertController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile:any;
  public birthDate:string;

  constructor(public navCtrl:NavController, public alertCtrl:AlertController, 
    public authProvider:AuthProvider, public profileProvider:ProfileProvider) {}

    // Get the user's profile from the service (and thus from firebase)
    // database event triggers and observers
    // .on('value', function(snapshot)) is a value observer to a list of data - when the databse reference being observed changes value, it returns an iterable list of all children nodes with values we can assign in the subsequent arrow function. list may have zero or only one item
    // see https://firebase.google.com/docs/database/web/read-and-write "listen for value events"

  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.birthDate = userProfileSnapshot.val().birthDate;
    });
  }

  // calls the logoutUser function and then it sets the LoginPage as our rootPage, so the user is taken to login without the ability to have a back button.
  logOut():void {
    this.authProvider.logoutUser().then( () => {
      this.navCtrl.setRoot('LoginPage');
    });
  }

  // We are creating a prompt here to ask users for their first and last name. Once we get them our “Save” button is going to call a handler, that is just going to take those first and last name and send them to the updateName function of ProfileProvider.

  updateName():void {
    const alert:Alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  // The Birth Date is even easier since we created an (ionChange) inside the <ion-datetime> we just need to call that function and use it to pass the birth date to ProfileProvider.

  updateDOB(birthDate:string):void {
    this.profileProvider.updateDOB(birthDate);
  }

  updateEmail():void {
    let alert:Alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {


            // TODO handle these responses better than using console messages

            this.profileProvider.updateEmail(data.newEmail, data.password).then( () =>{
              console.log("Email Changed Successfully");
            }).catch(error => {
              console.log('ERROR: '+error.message);
            });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword():void {
    let alert:Alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }
}