import {Component} from '@angular/core';
import { MyService } from  "../../../../theme/services/backend/service";
import {TreeModel} from 'ng2-tree';

@Component({
  selector: 'my-work',
  templateUrl: './work.html',
  providers :[MyService],
})

export class MyWork {

 

  constructor() {
  }

}
