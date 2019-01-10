import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})

export class KnowelApiService {

    url = "http://localhost:8888/interface.php";

    constructor(private http:Http) { }

  demo(){
    console.log('Service is up and running...!');
  }

  login(value) {
    let headers = new Headers({ 'Content-Type': 'application/json', "Accept": "text/plain" });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, value, options)
        .map(res => {
            // login successful if there's a jwt token in the response
            if (res) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('token', JSON.stringify(res));
            }
            return res;
        });
  }

  //added by sarita
  isLoggedIn() {
    //let tok = localStorage.getItem('token');
    console.log(localStorage.getItem('token'));
   return !!localStorage.getItem('token');
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('token');
      console.log("user removed");
  }

  fetchDataWithPollInterval(value): Observable<any>{
    return this.http.get(this.url)
    .pipe(
      map(this.extractData)
    );
  }

  getDataWithObservable(value): Observable<any[]> {
    return this.http.get(this.url, value)
    .map(this.extractData)
    .catch(this.handleErrorObservable);
  }

  postRequestWithObservable(value:any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', "Accept": "text/plain", 'Authorization': localStorage.getItem('token') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, value, options)
                .map(this.extractData)
                .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }

  private handleErrorObservable (error: Response | any) {
  //  console.error(error);
    return Observable.throw(error);
  }
}
