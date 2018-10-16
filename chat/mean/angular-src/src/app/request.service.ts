import { Injectable } from '@angular/core';

import { RequestOptions, Http,Headers } from '@angular/http';
import { User } from './models/User'

import { Observable, interval, pipe } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private serverApi= 'http://localhost:3000/mail';

  public isAdmin(){
    return sessionStorage.getItem("admin") === "true";
  }

  public getUsername(){
    return sessionStorage.getItem('username');
  }

  constructor(private http: Http) { }

  public login(username, password) {
    let URI = `${this.serverApi}/login/`;
    let headers = new Headers;
    let body = JSON.stringify({username:username, password:password});

    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public addUser(nw: User) {
    nw["token"] = sessionStorage.getItem("token");
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/addUser/`;
    let headers = new Headers;
    let body = JSON.stringify(nw);

    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public send(to: String, message: String) {
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/sendMessage/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token"), to:to, message:message} );
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public getIn() {
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/to/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token")} );
    headers.append('Content-Type', 'application/json');

    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public getOut() {
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/from/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token")} );
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public add(user) {
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/addUser/`;
    let headers = new Headers;

    var tmp = user;
    tmp['token'] = sessionStorage.getItem("token");
    let body = JSON.stringify( tmp );

    console.log(body);

    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public getHistory() {
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/log/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token")} );
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public getAllInfo(){
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/getAllInfo/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token")} );
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public update(user){
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/updateUser/`;
    let headers = new Headers;

    user['token'] = sessionStorage.getItem("token");
    let body = JSON.stringify( user );

    headers.append('Content-Type', 'application/json');
    return this.http.put(URI, body ,{headers: headers})
      .pipe(map(res => res.json()));
  }

  public delete(user){
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/deleteUser/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token"), username:user} );
    headers.append('Content-Type', 'application/json');
    return this.http.delete(URI, new RequestOptions({headers: headers, body: body}))
      .pipe(map(res => res.json()));
  }

  public exit(){
    let URI = `${this.serverApi}/${sessionStorage.getItem("username")}/exit/`;
    let headers = new Headers;
    let body = JSON.stringify( {token:sessionStorage.getItem("token")} );
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body, {headers:headers})
      .pipe(map(res => res.json()));
  }
}
