import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public service: ServicesService, private activerouter: ActivatedRoute, private route: Router, public datePipe: DatePipe) {
    this.activerouter.queryParams.subscribe((params: any) => {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = urlParams.get('access_token');
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        if (!localStorage.getItem('date')) {
          let date = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
          localStorage.setItem('date', date === null ? '' : date);
        }
        route.navigateByUrl('index')
      }

    });
  }
  auth() {
    this.service.authenricate();
  }
  create() {
    this.route.navigateByUrl('newuser')
  }
  ngOnInit(): void {

  }
}
