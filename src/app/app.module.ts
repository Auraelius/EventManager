import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { ProfileProvider } from '../providers/profile/profile';
import { Camera } from '@ionic-native/camera';

// From book: plugins will not work in the browser, when using ionic serve, they only work on a real phone or an emulator. luckily, the new version of Ionic Native lets us, mock providers. We can create a “Mock” class while we are in development and every time we call the plugin it will use the mock class, for example: When you take a picture, the camera returns a base64 string we will use to upload to Firebase Storage and show the pictures We will create a CameraMock class that returns a base64 string of our choosing, that way when we are developing the app we do not need to worry about testing in the device, and that can give us speed. 
// TODO Don’t forget to remove it before deploying your app, that means to remove the CameraMock class and to change the providers array to use Camera instead of {provide: Camera, useClass: CameraMock},.

class CameraMock extends Camera { getPicture(options){
  return new Promise( (resolve, reject) => { resolve(`TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIG
  J1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3a GljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ug b2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmV
  yYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2
  YgYW55IGNhcm5hbCBwbGVhc3VyZS4=`); });
  } }





@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    EventProvider,
    ProfileProvider,
    // Camera,
    {provide: Camera, useClass: CameraMock}
  ]
})
export class AppModule {}
