import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from './credentials';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    IonicModule.forRoot(),
    AppRoutingModule],
  providers: [
    StatusBar,
    AndroidFullScreen,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
