import { Component } from '@angular/core';
import { MyService } from  "../../../../theme/services/backend/service";
import { Router} from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

import { User } from "../../../../theme/models/user";

@Component({
  selector: 'users',
  templateUrl: './user.html',
  styleUrls: ['./smartTables.scss'],
  providers :[MyService],
})
export class Users {

  query: string = '';

  settings = {
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
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
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  custom_search= false;
    userStream : string = "Users";
    users : User[] = []; 

  constructor(private _router: Router ,private _service: MyService) {
    _service.listStreamItems(this.userStream).then(data => {
            data.forEach(element => {
                // console.log(this.Hex2String(element.data.toString()))
                let user : User = JSON.parse(this.Hex2String(element.data.toString()));
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

    

    Hex2String(hex_str:string) {
        let j;
        let hexes = hex_str.match(/.{1,4}/g) || [];
        let result_back = "";
        for (j = 0; j < hexes.length; j++) {
            result_back += String.fromCharCode(parseInt(hexes[j], 16));
        }

        return result_back;
    }

    goToProject(id : string){
        let link = ['/project', id];
        this._router.navigate(link);
    }
}
