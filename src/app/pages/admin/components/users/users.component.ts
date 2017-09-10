import { Component } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { User } from "../../../../theme/models/user";

@Component({
  selector: 'users',
  templateUrl: './user.html',
  styleUrls: ['./smartTables.scss'],
  providers: [MyService],
})
export class Users {

  query: string = '';

  settings = {
    actions: false,
    columns: {
      user_id: {
        title: 'ID',
        type: 'number'
      },
      name: {
        title: 'Full Name',
        type: 'string'
      },
      username: {
        title: 'Username',
        type: 'string'
      },
      email: {
        title: 'E-mail',
        type: 'string'
      },
      type: {
        title: 'User-Type',
        type: 'string'
      }
    },
    pager: {
      display: true,
      perPage: 20
    }
  };

  source: LocalDataSource = new LocalDataSource();

  custom_search = false;
  userStream: string = "Users";
  users: User[] = [];

  constructor(private _router: Router, private _service: MyService) {
    _service.listStreamItems(this.userStream).then(data => {
      data.forEach(element => {
        // console.log(this.Hex2String(element.data.toString()))
        let user: User = JSON.parse(this._service.Hex2String(element.data.toString()));
        user.user_id = element.txid;
        this.users.push(user);
      });
      console.log(this.users);
    });
    this.source.load(this.users);

  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  goToProject(id: string) {
    let link = ['/project', id];
    this._router.navigate(link);
  }
}
