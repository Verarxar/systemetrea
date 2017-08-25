import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
const api = '/api/admin';

export class CoordinateResponse {
  client;
  server;
  constructor(clientCoordinates: any, serverCoordinates: any){
    this.client = new Coordinates(clientCoordinates.lat, clientCoordinates.lon);
    this.server = new Coordinates(serverCoordinates.lat, serverCoordinates.lon);
  }
}

export class Coordinates {
  latitude: Number;
  longitude: Number;

  constructor(lat: number, lon: number) {
    this.latitude = lat;
    this.longitude = lon;
  }
};

@Injectable()
export class XmlService {

  constructor(private http: Http) {}

  fetchNewXml() {
    return this.http.get(`${api}/xml/fetch`).toPromise().then((response) => {
         console.log("wowo replaj", response);
         return response;
     }).catch((error) => {
       console.error("err fetching new XML: ", error);
       return "bug lol";
     });
  }

  getMapCoordinates() {
    let coords: Coordinates;
    const promises = [this.getCoords('json'), this.getCoords('json/www.systembolaget.se')];
    return Observable.forkJoin(promises).toPromise().then((res) => {
      const response = new CoordinateResponse(res[0], res[1]);
      return response;
    });
  }

  getCoords(url:string) {
    const uri = 'http://www.ip-api.com/' + url;
    return this.http.get(uri).toPromise().then((res) => {
      return res.json();
    });
  }

  getXmlFiles() {
    return this.http.get(`${api}/xml/files`).toPromise().then((response) => {
         console.log(response);
         return response.json();
     });
  }

  deleteXmlFile(fileName: string) {
    return this.http.delete(`${api}/xml/files/${fileName}`);
  }

}
