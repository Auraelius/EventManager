import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {
constructor() {}

  // The loginUser method takes an email and a password and logs in the user.
  // If the function has an error, it will return the error code and message  
  // If the function goes through, the user will log in, Firebase will store the authentication object in localStorage, and the function will return the user to a promise.

  loginUser(email:string, password:string):firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // creating a user does not store its information inside the database, it just stores it in the authentication module of our app, so we need to copy that information inside the database manually.
  // after it creates the user, the app also logs the user in automatically meaning we do not have to call the login function again.
  // The function returns a Promise that will run some code for us when it’s done creating the new user and login him into the app:
  // It starts with a reference to the userProfile node inside our database.
  // and creates a new node inside the userProfile node, and the UID identifies the node, the UID is Firebase automatic id generated for the user 
  // Also, it is adding a property to that node called email, filling it with the new user’s email address.

  signupUser(email:string, password:string):firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( newUser => {
          firebase.database().ref(`/userProfile/${newUser.uid}/email`).set(email)
      }).catch( error => console.error(error) );
  }

  // a function to let our users reset their passwords when they cannot remember them.
  // even tho it does return a Promise, the promise is empty, so you mainly use it to perform other actions once it sends the password reset link.
  // And Firebase will take care of the reset login. They send an email to your user with a password reset link, the user follows it and changes his password 
  resetPassword(email:string):firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  // logout fntion also returns a void promise. You will mainly use it to move the user to a different page (probably to LoginPage).
  // there’s one thing people struggle with when logging out, sometimes the app is still listening to the database references, and it creates errors when your security rules are set up, for that, we just need to turn the reference off before logging out.
  logoutUser():firebase.Promise<void> {
    const userId:string = firebase.auth().currentUser.uid;
    firebase.database().ref(`/userProfile/${userId}`).off();
    return firebase.auth().signOut();
  }



}
