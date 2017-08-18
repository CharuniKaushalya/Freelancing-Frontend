import {Component} from '@angular/core';
import { MyService } from  "../../../../theme/services/backend/service";
import {TreeModel} from 'ng2-tree';

@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  providers :[MyService]
})

export class Profile {

  	ChainInfo = null;
    PeerInfo = null;

    constructor(private _service: MyService) {
        _service.getinfo().then(data => {
            console.log(data);
            this.ChainInfo = data;
        });

        _service.getpeerinfo().then(data => {
            console.log(data);
            this.PeerInfo = data;
        });
    }

}
