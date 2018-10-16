import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { Router} from '@angular/router';
import { RequestService } from '../request.service'
import {OperationsComponent} from "../operations/operations.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  formdata;
  result;
  constructor(private router: Router, private Server: RequestService) { }
  ngOnInit() {

    this.formdata = new FormGroup({
      uname: new FormControl(),
      passwd: new FormControl()
    });
  }
  login(data) {
    this.Server.login(data.uname, data.passwd).subscribe( response =>
    {
        if( response.success === true ){

            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("username", data.uname);

            if( response.type === true )
              sessionStorage.setItem("admin", "true");
            else
              sessionStorage.setItem("admin", "false");


            this.router.navigate(['operations']);
        }
        else
            this.result = response.message;
    });
  }
}
