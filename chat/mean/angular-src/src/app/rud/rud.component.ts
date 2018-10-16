import { Component, OnInit } from '@angular/core';
import {RequestService} from "../request.service";

import {User} from '../models/User'
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-rud',
  templateUrl: './rud.component.html',
  styleUrls: ['./rud.component.css']
})
export class RUDComponent implements OnInit {

  public users: User[] = [];
  public info;
  public info1;
  public formdata: FormGroup[] = [];
  public tmpForm;
  public sorting = "username";

  constructor(private Server: RequestService) {
    this.tmpForm = new FormGroup({
      username: new FormControl(),
      name: new FormControl(),
      surname: new FormControl(),
      email: new FormControl(),
      type: new FormControl(),
      password: new FormControl(),
    });
  }

  ngOnInit() {
    this.loadList();
  }

  loadList(){
    this.Server.getAllInfo().subscribe( response => {

      if(response.success == true){
        this.users = response.users;
        this.formdata = [];

        this.info = "There are " + response.users.length +  " users.";

        for(let oo of this.users) {

          this.formdata.push(new FormGroup({
            username: new FormControl(),
            name: new FormControl(),
            surname: new FormControl(),
            email: new FormControl(),
            type: new FormControl(),
            password: new FormControl(),
          }));

        }

      }
      else{
        this.formdata = [];
        this.info = response.message;
      }
    });
  }

  update(user, pos){
    for(let i in this.users[pos])
      if(user[i] === null)
        user[i] =  this.users[pos][i];

      this.Server.update(user).subscribe(response => {

        if(response.success == true){
          this.users[pos] = user;
        }

        this.info1 = response.message;
      });

    console.log(user);

  }

  delete(user, pos){
    this.Server.delete(this.users[pos].username).subscribe( response => {
      if(response.success === true){
        this.users.splice(pos, 1);
        this.info = "There are " + this.users.length +  " users.";
      }
      this.info1 = response.message;
    });
  }

  getForm(x){

    if(x !== undefined)
      return this.formdata[x];
    else
      return this.tmpForm;
  }

  sort(name){
    this.sorting = name;
    this.users[0] = this.users[0];
  }

  trackByFn(){

  }

}
