import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../models/location.interface';
import { GateKeeperUrls } from '../models/gatekeeperurls.class';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(GateKeeperUrls.locationsUrl);
  }

  getMyLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(GateKeeperUrls.locationsSelfUrl);
  }

}
