import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { RequestService } from '../request.service'

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  constructor(private router: Router, public Server: RequestService) {

  }

  ngOnInit() {
  }

  navigate(to){
    this.router.navigate([to]);
  }

  exit(){
    console.log('at exit');
    this.Server.exit().subscribe(response => {sessionStorage.clear(); console.log(response)});
    this.router.navigate(['']);
  }

  getUsername(){
    return this.Server.getUsername();
  }

}
