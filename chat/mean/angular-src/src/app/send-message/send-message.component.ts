import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {RequestService} from "../request.service";
import {Router} from "@angular/router";

import {User} from '../models/User'

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  formdata;
  result;
  constructor(private router: Router, private Server: RequestService) { }
  ngOnInit() {

    this.formdata = new FormGroup({
      username: new FormControl(),
      message: new FormControl()
    });
  }

  send(data){
      this.Server.send(data.username, data.message).subscribe(response => {this.result=response.message;});

      this.formdata.reset();
  }

}
