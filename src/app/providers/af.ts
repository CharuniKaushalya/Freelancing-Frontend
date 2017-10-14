import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';

import {AngularFireAuth} from 'angularfire2/auth';

import {FirebaseObjectFactoryOpts} from "angularfire2/database-deprecated/interfaces";

@Injectable()
export class AF {
    public messages: FirebaseListObservable<any[]>;
    public users: FirebaseListObservable<any[]>;
    public displayName: string;
    public email: string;
    public user: any;

    constructor(public af: AngularFireDatabase, public afa: AngularFireAuth) {

        afa.authState.subscribe(user => {
            console.log(user);
            this.user = user;
            console.log("as");
            console.log(user.email);
            if (user.email != null) {
                this.displayName = user.email;
                this.email = user.email;
            }
        });
        this.messages = af.list('messages');
        this.users = af.list('users');
    }

    getMessages(chat_id: string): FirebaseListObservable<any[]>{
        let msgList: FirebaseListObservable<any[]>;

        msgList = this.af.list('messages/'+chat_id);
        return msgList;
    }

    // getFist(): FirebaseListObservable<any[]> {
    //     return this.af.object('messages').first()
    // }

    addUserInfo() {
        //We saved their auth info now save the rest to the db.
        this.users.push({
            email: this.email,
            displayName: this.displayName
        });
    }


    sendMessage(text, chat_id) {

        let list = this.af.list('messages/'+chat_id);

        let message = {
            message: text,
            displayName: this.displayName,
            email: this.email,
            timestamp: Date.now()
        };
        list.push(message);
    }
}
