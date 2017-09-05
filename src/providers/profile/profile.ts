import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ProfileProvider {
  public userProfile:firebase.database.Reference;
  public currentUser:firebase.User;

  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUserProfile():firebase.database.Reference {
    return this.userProfile;
  }

  updateName(firstName:string, lastName:string):firebase.Promise<any> {

    // We’re using .update() here because we only want to update the firstName and lastName properties, if we were to use .set() to write to the database, it would delete everything under the user’s profile and replace it with the first and last name. .update() also returns a promise, but it is void, meaning it has nothing inside, so you use it just to see when the operation was completed and then perform something else.

    return this.userProfile.update({ firstName, lastName });
  }

  updateDOB(birthDate:string):firebase.Promise<any> {
    return this.userProfile.update({ birthDate });
  }

  // TODO provide functions for other profile information in addition to DOB here.

  //Now is where things get a little trickier, we are going to change the user’s email address, why is it tricky? Because we are not only going to alter the email from the database, we are going to change it from the authentication service too. That means that we are changing the email the user uses to log into our app, and you cannot just call the change email function and have it magically work. This is because some security-sensitive actions (deleting an account, setting a primary email ad- dress, and changing a password) require that the user has recently signed-in. If you perform one of these actions, and the user signed in too long ago, the operation fails with an error. When this happens, re-authenticate the user by getting new sign-in credentials from the user and passing the credentials to reauthenticate.

  updateEmail(newEmail:string, password:string):firebase.Promise<any> {
    
    // We are using firebase.auth.EmailAuthProvider.credential(); to create a credential object, Firebase uses this for authentication.

    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, password);

    // We are passing that credential object to the re-authenticate function to make sure the user trying to change the email is the actual user who owns the account. After the re-authenticate function is completed we’re calling .updateEmail() and passing the new email address.  After the user’s email address is updated in the authentication service we proceed to call the profile reference from the database and also refresh the email there.

    return this.currentUser.reauthenticateWithCredential(credential)
    .then( user => {
      this.currentUser.updateEmail(newEmail)
      .then( user => {
        this.userProfile.update({ email: newEmail });
      });
    }).catch( error => {
      console.error(error); // TODO can we handle this better?
    });
  }

  updatePassword(newPassword:string, oldPassword:string):firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, oldPassword);

    return this.currentUser.reauthenticateWithCredential(credential).then( user => {
      this.currentUser.updatePassword(newPassword).then( user => {
        console.log("Password Changed"); // TODO can we handle this better?
      });
    }).catch( error => {
      console.error(error); // TODO can we handle this better?
    });
  }
}