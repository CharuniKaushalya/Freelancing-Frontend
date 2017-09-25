import { Component, OnInit } from '@angular/core';
import { MyService } from "../../../../theme/services/backend/service";
import { TreeModel } from 'ng2-tree';
import { Router } from '@angular/router';

import { User } from "../../../../theme/models/user";

@Component({
    selector: 'wallet',
    templateUrl: './wallet.html',
    providers: [MyService],
})

export class Wallet implements OnInit {

    userStream: string = "Users";
    user = new User();

    assets = [
        {
            asset_name: 'USD',
            available_balance: 0,
            locked_amount: 0,
            requested_amount: ''
        },
        {
            asset_name: 'BTC',
            available_balance: 0,
            locked_amount: 0,
            requested_amount: ''
        }
    ];

    constructor(private _router: Router, private _service: MyService) {
        this._service.listStreamKeyItems(this.userStream, localStorage.getItem('email')).then(data => {
            this.user = JSON.parse(this._service.Hex2String(data[0].data.toString()));

            this._service.getAddressBalances(this.user.address, 'False').then(unlocked_balances => {

                if(unlocked_balances[0].name == "USD") {
                    this.assets[0].available_balance = unlocked_balances[0].qty;
                    this.assets[1].available_balance = unlocked_balances[1].qty;

                } else {
                    this.assets[0].available_balance = unlocked_balances[1].qty;
                    this.assets[1].available_balance = unlocked_balances[0].qty;
                }

                this._service.getAddressBalances(this.user.address, 'True').then(total_balances => {

                    if(total_balances[0].name == "USD") {
                        this.assets[0].locked_amount = total_balances[0].qty - this.assets[0].available_balance;
                        this.assets[1].locked_amount = total_balances[1].qty - this.assets[1].available_balance;

                    } else {
                        this.assets[0].locked_amount = total_balances[1].qty - this.assets[0].available_balance;
                        this.assets[1].locked_amount = total_balances[0].qty - this.assets[1].available_balance;
                    }
                });
            });
        });
    }

    ngOnInit() {
    }

    getAsset(asset: string) {

        if (asset == "USD") {
            this._service.sendAsset(this.user.address, asset, this.assets[0].requested_amount.toString()).then(data => {

                this.assets[0].available_balance = Number(this.assets[0].available_balance) + Number(this.assets[0].requested_amount);
                this.assets[0].requested_amount = '';
            });

        } else {
            this._service.sendAsset(this.user.address, asset, this.assets[1].requested_amount.toString()).then(data => {

                this.assets[1].available_balance = Number(this.assets[1].available_balance) + Number(this.assets[1].requested_amount);
                this.assets[1].requested_amount = '';
            });
        }
    }

    goToUser(id: string) {
        let link = ['/pages/users/profile', id];
        this._router.navigate(link);
    }
}
