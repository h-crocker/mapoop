/* tslint:disable:prefer-const */
import {Component, OnInit} from '@angular/core';
import {AndroidFullScreen} from '@ionic-native/android-full-screen/ngx';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  LatLng,
  Marker,
  MarkerOptions,
  Environment
} from '@ionic-native/google-maps';
import { FirestoreService } from '../services/data/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: GoogleMap;
  public markerList;
  public data;

  // current location
  location: LatLng = new LatLng(0, 0);

  constructor(private platform: Platform,
              private androidFullScreen: AndroidFullScreen,
              public router: Router,
              private firestoreService: FirestoreService,
              private geolocation: Geolocation) {
  }

  // run async on init (MAIN)
  async ngOnInit() {
    this.androidFullScreen.showUnderStatusBar();
    await this.platform.ready();
    // get marker list
    this.markerList = this.firestoreService.getMarkerList();
    // wait until get current location
    await this.geolocation.getCurrentPosition().then((position) =>  {
      this.location.lat = position.coords.latitude;
      this.location.lng = position.coords.longitude;
    });
    // load map and move camera to current location
    await this.loadMap();
    await this.map.setPadding(24, 4, 58, 4);
    await this.moveCamera(this.location);

    // init geolocation subscriber
    let geolocWatch = this.geolocation.watchPosition();
    geolocWatch.subscribe((data) => {
      this.location.lat = data.coords.latitude;
      this.location.lng = data.coords.longitude;
    });

    console.log('MARKER LIST');
    // get markers from cloud firestore and add to map
    this.markerList.subscribe((data) => {
      // for each firestore entry add a marker to the map
      data.forEach(dataEntry => {
        // console.log(dataEntry.name);
        // console.log(dataEntry.lat + ', ' + dataEntry.lng);

        let MARKER_OPTIONS: MarkerOptions = {
          title: dataEntry.name,
          icon: {
            url: './assets/markers/toilet_marker.png',
            size: {
              width: 48,
              height: 48
            }
          },
          position: {
            lat: dataEntry.lat,
            lng: dataEntry.lng
          }
        };

        this.map.addMarker(MARKER_OPTIONS);
      });
    });
  }

  loadMap() {
    // Cannot view google maps using ionic serve, use cordova run browser
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: '~~INSERT API KEY HERE~~',
      API_KEY_FOR_BROWSER_DEBUG: '~~INSERT API KEY HERE~~'
    });

    let options: GoogleMapOptions = {
      controls: {
        compass: false,
        myLocationButton: true,
        myLocation: true,   // (blue dot)
        indoorPicker: false,
        zoom: false,          // android only
        mapToolbar: false     // android only
      },

      gestures: {
        scroll: true,
        tilt: false,
        zoom: true,
        rotate: false
      }
    };

    // Attach google map to map canvas
    this.map = GoogleMaps.create('map_canvas', options);
  }

  // function to move map camera
  moveCamera(loc: LatLng) {
    this.map.moveCamera({
      target: loc,
      tilt: 15,
      zoom: 17
    });
  }

  // go to add a toilet page, share lat and lng
  goToCreatePage() {
    this.router.navigate(['/create', {lat: this.location.lat, lng: this.location.lng}]);
  }
}
