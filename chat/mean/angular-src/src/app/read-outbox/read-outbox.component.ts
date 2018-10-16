import { Component, OnInit } from '@angular/core';
import { Message } from "../models/Message";
import {RequestService} from "../request.service";

@Component({
  selector: 'app-read-outbox',
  templateUrl: './read-outbox.component.html',
  styleUrls: ['./read-outbox.component.css']
})
export class ReadOutboxComponent implements OnInit {

  public messages: Message[] = [];
  public info;
  public sorting = "message";

  constructor(private Server: RequestService) { }

  ngOnInit() {
    this.loadList();
  }

  loadList(){
    this.Server.getOut().subscribe( response => {
      console.log(response);
      if(response.success == true){
        this.messages = response.message;

        this.info = "There are " + response.message.length +  " messages.";
      }
      else{
        this.info = response.message;
      }
    });
  }

  sort(name){
    this.sorting = name;
  }

}
