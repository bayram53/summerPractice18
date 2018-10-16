import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestService } from './request.service'
//import { Ng2OrderModule } from 'ng2-order-pipe'

import {HttpModule} from "@angular/http";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ReadInboxComponent } from './read-inbox/read-inbox.component';
import { ReadOutboxComponent } from './read-outbox/read-outbox.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { AddUserComponent } from './add-user/add-user.component';
import { RUDComponent } from './rud/rud.component';
import { SystemLogComponent } from './system-log/system-log.component';
import { OperationsComponent } from './operations/operations.component';


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<any>, orderProperty: string): Array<any> {
    array.sort((a: any, b: any) => {
      if (a[orderProperty] < b[orderProperty]) {
        return -1;
      } else if (a[orderProperty] > b[orderProperty]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}

const appRoutes: Routes = [
  {
      path: '',
      component: LoginComponent,
  },

  {
    path: 'operations',
    component: OperationsComponent,
    children: [
      {
        path: 'inbox',
        component: ReadInboxComponent,
      },
      {
        path: 'outbox',
        component: ReadOutboxComponent,
      },
      {
        path: 'message',
        component: SendMessageComponent,
      },
      {
        path: 'add',
        component: AddUserComponent,
      },
      {
        path: 'rud',
        component: RUDComponent,
      },
      {
        path: 'log',
        component: SystemLogComponent,
      }
    ]
  }
];


@NgModule({
  declarations: [
    OrderByPipe,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ReadInboxComponent,
    ReadOutboxComponent,
    SendMessageComponent,
    AddUserComponent,
    RUDComponent,
    SystemLogComponent,
    OperationsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    HttpModule,
  ],
  providers: [RequestService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
