import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {RequestService} from "../request.service";
import {Router} from "@angular/router";

//import {User} from '../models/User';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  formdata;
  result;
  constructor(private router: Router, private Server: RequestService) { }
  ngOnInit() {

    this.formdata = new FormGroup({
      username: new FormControl(),
      name: new FormControl(),
      surname: new FormControl(),
      email: new FormControl(),
      type: new FormControl(),
      password: new FormControl(),

    });
  }

  add(data){
    this.Server.add(data).subscribe(response => this.result = response.message);

    this.formdata.reset();
  }

}
