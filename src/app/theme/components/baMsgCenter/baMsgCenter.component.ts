import {Component} from '@angular/core';

import {AuthService} from '../../../providers/auth.service';
import {MyService} from "../../services/backend/service";
import {BaMsgCenterService} from './baMsgCenter.service';
import {AF} from '../../../providers/af';
import {Router} from '@angular/router';

@Component({
    selector: 'ba-msg-center',
    providers: [BaMsgCenterService],
    styleUrls: ['./baMsgCenter.scss'],
    templateUrl: './baMsgCenter.html'
})
export class BaMsgCenter {

    public notifications = [];
    public messages = [];
    private auth: any;
    userStream: string = "Users";
    userType: string = "";
    msg_subscribed = true;
    notification_subscribed = true;

    constructor(private _baMsgCenterService: BaMsgCenterService, public authService: AuthService, private _service: MyService, public afService: AF, private _router: Router) {
        // this.notifications = this._baMsgCenterService.getNotifications();
        // this.messages = this._baMsgCenterService.getMessages();

        this.authService.getAuth().authState.subscribe(user => {
            this.auth = user;

            if (this.auth != null) {
                this._service.listStreamKeyItems(this.userStream, this.auth.email).then(data => {
                    if (data[data.length - 1]) {
                        let user = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                        let array = null;
                        localStorage.setItem("userType", user.type);
                        this.userType = user.type;
                        localStorage.setItem("userId", data[data.length - 1].txid);

                        let userAddress = localStorage.getItem("address");
                        let userEmail = localStorage.getItem("email");


                        this.afService.messages.subscribe(allMessages => {
                            for (let i = 0; i < allMessages.length; i++) {
                                if ((allMessages[i].$key).includes(userAddress)) {

                                    let msgList = this.afService.getMessages(allMessages[i].$key);

                                    msgList.subscribe(msgs => {
                                        if (this.msg_subscribed) {
                                            let last = msgs[msgs.length - 1];

                                            if (last.email != userEmail) {

                                                this._service.listStreamKeyItems(this.userStream, last.displayName).then(data => {
                                                    let sender = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
                                                    last.id = allMessages[i].$key;
                                                    last.displayName = sender.name;

                                                    if (allMessages[i].$key.length > 76)
                                                        last.displayName = sender.name + ' (Discussion)';
                                                    this.messages.push(last);

                                                    if (i == allMessages.length - 1) {
                                                        this.msg_subscribed = false;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });

                        this.afService.notifications.subscribe(allNotifications => {
                            for (let i = 0; i < allNotifications.length; i++) {
                                if (allNotifications[i].$key == userAddress) {

                                    let msgList = this.afService.getNotifications(allNotifications[i].$key);

                                    msgList.subscribe(msgs => {
                                        if (this.notification_subscribed) {
                                            let last = msgs[msgs.length - 1];

                                            if (last.email != userEmail) {

                                                last.id = allNotifications[i].$key;

                                                this.notifications.push(last);

                                                if (i == allNotifications.length - 1) {
                                                    this.notification_subscribed = false;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                localStorage.setItem("userType", "");
                localStorage.setItem("userId", "");
            }
        });
        console.log(localStorage.getItem("userType"));
    }

    goToChat(id: string) {
        let link = ['/pages/chat/chat_view', id];
        this._router.navigate(link);
    }
}
