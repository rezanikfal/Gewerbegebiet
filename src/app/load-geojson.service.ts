import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoadGeojsonService {
  constructor(private http: HttpClient) { }
  asDesignedData() {
    return this.http.get(
      'http://10.19.8.22:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3AvAsDesignedGew&maxFeatures=2000&outputFormat=application%2Fjson'
    );
  }

  asBuiltData() {
    return this.http.get(
      'http://10.19.8.22:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3AvAsBuiltGew&maxFeatures=2000&outputFormat=application%2Fjson'
    );
  }
}