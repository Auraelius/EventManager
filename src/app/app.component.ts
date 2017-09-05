import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    firebase.initializeApp({
      apiKey: "AIzaSyDBUyiKkmGeafh6Xwxnh8_WuY4FfyD9GRU",
      authDomain: "eventmanager-7bf03.firebaseapp.com",
      databaseURL: "https://eventmanager-7bf03.firebaseio.com",
      projectId: "eventmanager-7bf03",
      storageBucket: "eventmanager-7bf03.appspot.com",
      messagingSenderId: "487834407993"
    });

    //  https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
    // when you log in or signup using Firebase, it will store an auth object inside your localStorage.
    // This object has information about the user’s profile, such as user’s email, name, ID, what kind of authentication used, among others. So the onAuthStateChanged() function looks for that object to see if a user already exists or not. If the user doesn’t exist, the user variable will be null, which will trigger the if statement and make the rootPage = 'LoginPage'.
    // However, if there’s a user, it will return the user’s information, at that point the listener is going to send the user to the HomePage since the user should not need to re-login inside the app.
    // The unsubscribe(); is because we are telling the function to call itself once it redirects the user,this is because the onAuthStateChanged() returns the unsubscribe function for the observer. Meaning it will stop listening to the authentication state unless you run it again (it runs every time someone opens the app).

    const unsubscribe = firebase.auth().onAuthStateChanged( user => {
      if(!user){
        this.rootPage = 'LoginPage';
        unsubscribe();
      } else {
        this.rootPage = HomePage;
        unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

