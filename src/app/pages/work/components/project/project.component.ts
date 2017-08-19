import {Component} from '@angular/core';
import { MyService } from  "../../../../theme/services/backend/service";
import {TreeModel} from 'ng2-tree';

@Component({
  selector: 'my-projects',
  templateUrl: './project.html',
  providers :[MyService],
})

export class MyProjects {

 

  constructor() {
  }

}
