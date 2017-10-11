import {Component, OnInit, AfterViewChecked, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FirebaseListObservable} from 'angularfire2/database-deprecated';
import { AF } from '../../../../providers/af';

@Component({
  selector: 'chat',
  templateUrl: './chat_view.html',
  styleUrls: ['./chat_view.component.css']
})
export class ChatView implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public newMessage: string;
  public messages: FirebaseListObservable<any>;
  public contract_id:string;

  constructor(public afService: AF ,private _route: ActivatedRoute, private _router: Router) {
    this.messages = this.afService.messages;
    this.contract_id= "asdfghtrhkihkhkkmmmm";

    this._route.params.forEach((params: Params) => {
            if (params['contract_id'] !== undefined) {
                this.contract_id = params['contract_id'];

                console.log(this.contract_id);
                

        


               


            } else {

            }
        });

  }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage(){
    this.afService.sendMessage(this.newMessage, this.contract_id);
    this.newMessage = '';
  }

  isYou(email) {
    if(email == this.afService.email)
      return true;
    else
      return false;
  }

  isMe(email) {
    if(email == this.afService.email)
      return false;
    else
      return true;
  }
}
