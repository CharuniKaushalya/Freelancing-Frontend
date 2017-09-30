import { Component, OnInit } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { TreeModel } from 'ng2-tree';
import { Router } from '@angular/router';

import { User } from "../../../../theme/models/user";

@Component({
    selector: 'users',
    templateUrl: './user.html',
    styleUrls: ['./basicTables.scss'],
    providers: [MyService],
})

export class MyUsers implements OnInit {
    custom_search = false;
    usersStream: string = "Users";
    users: User[] = [];

    constructor(private _router: Router, private _service: MyService) {
        _service.listStreamItems(this.usersStream).then(data => {
            data.forEach(element => {
                let user: User;
                if (element.data.txid == null) {
                    user = JSON.parse(this._service.Hex2String(element.data.toString()));
                    user.user_id = element.txid;
                    this.users.push(user);
                } else {
                    _service.gettxoutdata(element.data.txid).then(largedata => {
                        user = JSON.parse(this._service.Hex2String(largedata.toString()));
                        user.user_id = element.txid;
                        this.users.push(user);
                    }).catch(error => {
                        console.log(error.message);
                    });
                }

            });
            console.log(this.users);
        }).catch(error => {
            console.log(error.message);
        });
    }

    ngOnInit() {
    }

    goToUser(id: string) {
        let link = ['/pages/users/profile', id];
        this._router.navigate(link);
    }
}
