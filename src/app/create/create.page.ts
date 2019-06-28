import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { LatLng } from '@ionic-native/google-maps';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../services/data/firestore.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  // current location
  location: LatLng = new LatLng(0, 0);
  name = '';
  buildingType = 'public_toilet';
  rating = 0;
  review = '';

  constructor(private platform: Platform,
              private firestoreService: FirestoreService,
              public navCtrl: NavController,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.location.lat = Number(this.route.snapshot.paramMap.get('lat'));
    this.location.lng = Number(this.route.snapshot.paramMap.get('lng'));

    this.platform.ready();
  }

  submit() {
      console.log('sending to firestore');
      this.firestoreService.createMarker(this.location.lat, this.location.lng, this.name, this.buildingType).then(resp => {
          this.name = '';
          this.buildingType = '';
          console.log(resp);
      }).catch(error => {
          console.log(error);
      });

      this.navCtrl.navigateRoot('/home');
  }
}
