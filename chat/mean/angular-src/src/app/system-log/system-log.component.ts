import { Component, OnInit } from '@angular/core';
import {Log} from "../models/Log";
import {RequestService} from "../request.service";

@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['./system-log.component.css']
})
export class SystemLogComponent implements OnInit {

  public hist: Log[]=[];
  public info;
  public sorting = "username";
  constructor(private Server: RequestService) { }

  ngOnInit() {
    this.loadList();
  }

  loadList(){
    this.Server.getHistory().subscribe( response => {
      console.log(response);
      if(response.success == true){
        this.hist = response.message;

        this.info = "There are " + response.message.length +  " succesfully login info.";
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
