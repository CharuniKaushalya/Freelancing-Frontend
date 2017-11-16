import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocumentationComponent implements OnInit {

  sectionScroll;
  constructor(private router:Router) { }
  internalRoute(page,dst){
    console.log("here come");
      this.sectionScroll=dst;
      this.router.navigate([page], {fragment: dst});
  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.doScroll();
      this.sectionScroll= null;
    });
  }

  doScroll() {
    
        if (!this.sectionScroll) {
          return;
        }
        try {
          var elements = document.getElementById(this.sectionScroll);
    
          elements.scrollIntoView();
        }
        finally{
          this.sectionScroll = null;
        }
      } 

}
