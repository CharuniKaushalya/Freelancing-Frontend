import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MyService} from "../../../../theme/services/backend/service";
import {PaymentModal} from '../payment-modal/payment.component';
import {TreeModel} from 'ng2-tree';
import {Router, Params, ActivatedRoute} from '@angular/router';

import {User} from "../../../../theme/models/user";

@Component({
    selector: 'wallet',
    templateUrl: './wallet.html',
    providers: [MyService],
})

export class Wallet implements OnInit {

    userStream: string = "Users";
    user_id: string = "";
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

    constructor(private _router: Router, private _route: ActivatedRoute, private _service: MyService, private modalService: NgbModal) {
        this._service.listStreamKeyItems(this.userStream, localStorage.getItem('email')).then(data => {
            this.user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
            this._service.getAddressBalances(this.user.address, 'False').then(unlocked_balances => {


                if (unlocked_balances.length == 1) {
                    console.log();
                    this.assets[0].available_balance = unlocked_balances[0].qty;
                }

                this._service.getAddressBalances(this.user.address, 'True').then(total_balances => {
                    console.log();
                    if (unlocked_balances.length == 1) {
                        this.assets[0].locked_amount = total_balances[0].qty - this.assets[0].available_balance;
                    }
                }).catch(error => {
                    console.log(error.message);
                });
            }).catch(error => {
                console.log(error.message);
            });
        }).catch(error => {
            console.log(error.message);
        });
    }

    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            if (params['user_id'] !== undefined) {
                this.user_id = params['user_id'];
            }
        });
    }

    getAsset(asset: string) {

        // this._service.lockAssetsFrom(this.user.address, "USD", "130").then(data => {
        //     console.log("Assets Locked");
        //     console.log(data);
        // });

        // this._service.unlockAllAssets().then(data => {
        //     console.log("Assets UnLocked");
        //     console.log(data);
        // });

        if (asset == "USD") {
            this._service.sendAsset(this.user.address, asset, this.assets[0].requested_amount.toString()).then(data => {

                this.assets[0].available_balance = Number(this.assets[0].available_balance) + Number(this.assets[0].requested_amount);
                this.assets[0].requested_amount = '';
            }).catch(error => {
                console.log(error.message);
            });

        } else {
            this._service.sendAsset(this.user.address, asset, this.assets[1].requested_amount.toString()).then(data => {

                this.assets[1].available_balance = Number(this.assets[1].available_balance) + Number(this.assets[1].requested_amount);
                this.assets[1].requested_amount = '';
            }).catch(error => {
                console.log(error.message);
            });
        }
    }

    goToUser(id: string) {
        let link = ['/pages/users/profile', id];
        this._router.navigate(link);
    }

    paymentModalShow(): void {
        const activeModal = this.modalService.open(PaymentModal, {size: 'sm'});
        activeModal.componentInstance.modalHeader = '';
        activeModal.componentInstance.amount = this.assets[0].requested_amount;
        activeModal.componentInstance.profile_id = this.user_id;
        activeModal.result
            .then((d) => {
                console.log("result");
            });
    }
}
