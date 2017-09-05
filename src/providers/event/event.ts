import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventProvider {
  public eventListRef:firebase.database.Reference;

  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        //  create a variable to hold our userProfile database reference so that we can use it in all of our functions.
        this.eventListRef = firebase.database().ref(`/userProfile/${user.uid}/eventList`);
      }
    });
  }

  getEventList():firebase.database.Reference {
    return this.eventListRef;
  }

  getEventDetail(eventId:string):firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }

  // We are using .push() on the eventList node because we want firebase to append every new object to this list, and to auto-generate a random ID, so we know there aren’t going to be two objects with the same ID.
  createEvent(eventName:string, eventDate:string, eventPrice:number, eventCost:number):
  firebase.Promise<any> {
    return this.eventListRef.push({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }
// Add new guest, then update the revenue using transactions to avoid conflicts
  addGuest(guestName:string, eventId:string, eventPrice:number): firebase.Promise<any> {
    return this.eventListRef.child(`${eventId}/guestList`).push({ guestName }) 
      .then( newGuest => {
        this.eventListRef.child(eventId).transaction( event => { 
          event.revenue += eventPrice;
          return event;
        }); 
      });
    }

  // addGuest(guestName:string, eventId:string, eventPrice:number, guestPicture:string = null):
  // firebase.Promise<any> {
  //   return this.eventListRef.child(`${eventId}/guestList`).push({ guestName })
  //     .then( newGuest => {
  //       this.eventListRef.child(eventId).transaction( event => {
  //         event.revenue += eventPrice;
  //         return event;
  //       });
  //       if(guestPicture != null){
  //         firebase.storage().ref(`/guestProfile/${newGuest.key}/profilePicture.png`)
  //           .putString(guestPicture, 'base64', {contentType: 'image/png'})
  //           .then( savedPicture => {
  //             this.eventListRef.child(`${eventId}/guestList/${newGuest.key}/profilePicture`)
  //             .set(savedPicture.downloadURL);
  //           });
  //       }
  //     });
  // }
}