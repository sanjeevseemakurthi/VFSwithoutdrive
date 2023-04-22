import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public service: ServicesService, private route: Router) {
    if (this.service.holdcreatedata) {
      Object.keys(this.service.holdcreatedata).forEach((element: any) => {
        this.service.savefileindrive(this.service.holdcreatedata[element], element)
      });
      this.service.holdcreatedata = null;
    }
  }

  ngOnInit(): void {

  }
  daysheet() {
    this.route.navigateByUrl('Daysheet')
  }
  engineoils() {

  }
  balance() {

  }



}
