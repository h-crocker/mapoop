/* tslint:disable */
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore) { }

  getMarkerList(): Observable<any> {
    return this.firestore.collection(`markers`).valueChanges();
  }

  createMarker(lat: number, lng: number, name: string, type: string) {
    let record = {};
    record['lat'] = lat;
    record['lng'] = lng;
    record['name'] = name;
    record['type'] = type;

    return this.firestore.collection('markers').add(record);
  }
}
