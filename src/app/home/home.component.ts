import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public service: ServicesService) {
    if (this.service.holdcreatedata) {
      Object.keys(this.service.holdcreatedata).forEach((element: any) => {
        this.service.savefileindrive(this.service.holdcreatedata[element], element)
      });
      this.service.holdcreatedata = null;
    }
  }

  ngOnInit(): void {
  }

}
