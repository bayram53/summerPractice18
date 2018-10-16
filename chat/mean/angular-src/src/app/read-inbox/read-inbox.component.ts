import { Component, OnInit } from '@angular/core';
import { Message } from '../models/Message';
import {RequestService} from '../request.service';

@Component({
  selector: 'app-read-inbox',
  templateUrl: './read-inbox.component.html',
  styleUrls: ['./read-inbox.component.css']
})
export class ReadInboxComponent implements OnInit {

  public messages: Message[] = [];
  public info;
  public sorting = "message";

  constructor(private Server: RequestService) { }

  ngOnInit() {
    this.loadList();
  }

  loadList(){
    this.Server.getIn().subscribe( response => {
      console.log(response);
      if(response.success == true){
        this.messages = response.message;

        this.info = "There are " + response.message.length + " messages";
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
