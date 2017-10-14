import {Component, OnInit, AfterViewChecked, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {MyService} from "../../../../theme/services/backend/service";
import {FirebaseListObservable} from 'angularfire2/database-deprecated';
import {AF} from '../../../../providers/af';

import {User} from "../../../../theme/models/user";

@Component({
    selector: 'chat',
    templateUrl: './chat_view.html',
    styleUrls: ['./chat_view.component.css']
})

export class ChatView implements OnInit, AfterViewChecked {

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    public newMessage: string;
    public messages: FirebaseListObservable<any>;
    public chat_id: string;
    userstream: string = "Users";
    isDiscussion = false;
    users = [];

    constructor(public afService: AF, private _route: ActivatedRoute, private _router: Router, private _service: MyService) {

        _route.params.forEach((params: Params) => {
            if (params['chat_id'] !== undefined) {
                this.chat_id = params['chat_id'];

                this.messages = this.afService.getMessages(this.chat_id);
                let userEmail = localStorage.getItem("email");

                if (this.chat_id.length > 76)
                    this.isDiscussion = true;

                this._service.listStreamItems(this.userstream).then(data => {
                    data.reverse();
                    for(let i=0; i<data.length; i++) {
                        let user = JSON.parse(this._service.Hex2String(data[i].data.toString()));

                        if(user.email != userEmail) {
                            if(this.chat_id.includes(user.address)) {
                                if(this.users.length == 0) {
                                    user.user_id = data[i].txid;
                                    this.users.push(user);

                                } else if(this.users.length == 1 && this.isDiscussion) {
                                    if(this.users[0].email != user.email) {
                                        user.user_id = data[i].txid;
                                        this.users.push(user);
                                    }
                                }
                            }
                        }
                    }
                    console.log(this.users);
                });
            }
        });
    }

    ngOnInit() {
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (error) {
            console.log(error)
        }
    }

    sendMessage() {
        if ($('#msgBox').val().trim().length > 0) {
            this.afService.sendMessage(this.newMessage, this.chat_id);
            this.newMessage = '';
        }
    }

    isYou(email) {
        if (email == this.afService.email)
            return true;
        else
            return false;
    }

    isMe(email) {
        if (email == this.afService.email)
            return false;
        else
            return true;
    }

    goBack() {
        window.history.back();
    }

    goToUser(id: string) {
        let link = ['/pages/users/profile', id];
        this._router.navigate(link);
    }
}
