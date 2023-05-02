import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fileids: any = {};
  engineoilsoptions: any[] = [];
  perticularoptons: any[] = [];
  display = false;
  selected: any[] = [];
  selectedfilename = '';
  colselected: string[] = [];
  searchselected = ''
  constructor(public service: ServicesService, private route: Router) {
    if (this.service.holdcreatedata) {
      Object.keys(this.service.holdcreatedata).forEach((element: any) => {
        this.service.savefileindrive(this.service.holdcreatedata[element], element)
      });
      this.service.holdcreatedata = null;
    }
    this.service.getAllfiles().subscribe((res: any) => {
      let str = localStorage.getItem('files');
      res = JSON.parse(str ? str : '');
      res.files.forEach((res: any) => {
        let name = res.name.split('.')[0];
        let fileid = res.id;
        this.fileids[name] = fileid;
      });
    });
  }

  ngOnInit(): void {

  }
  daysheet() {
    this.route.navigateByUrl('Daysheet')
  }
  engineoils() {
    this.selectedfilename = 'engineoils';
    this.display = true;
    this.service
      .readingfiles(this.fileids['engineoils'])
      .subscribe((data: any) => {
        let str = localStorage.getItem(this.fileids['engineoils']);
        let hold = JSON.parse(str ? str : '');
        let resultdata: any[] = [];
        hold.forEach((element: any, index: number) => {
          let row = {
            name: element[0],
            qty: element[1],
            exist: true
          };
          resultdata.push(row);
        });
        this.engineoilsoptions = resultdata;
        this.selected = this.engineoilsoptions;
        this.colselected = Object.keys(this.engineoilsoptions[0])
      });
  }
  balance() {
    this.selectedfilename = 'perticulars';
    this.display = true;
    this.service
      .readingfiles(this.fileids['perticulars'])
      .subscribe((data: any) => {
        let str = localStorage.getItem(this.fileids['perticulars']);
        let hold = JSON.parse(str ? str : '');
        let resultdata: any[] = [];
        hold.forEach((element: any, index: number) => {
          let row = {
            name: element[0],
            balance: element[1],
            exist: true
          };
          resultdata.push(row);
        });
        this.perticularoptons = resultdata;
        this.selected = this.perticularoptons;
        this.colselected = Object.keys(this.perticularoptons[0])
      });
  }
  submit() {
    if (this.selectedfilename === 'engineoils') {
      let enginwoilsswritdata: any[][] = [];
      this.engineoilsoptions.forEach((element: any, index: any) => {
        enginwoilsswritdata.push([element.name, element.qty, index]);
      });
      let csvContent = enginwoilsswritdata
        .map((row: any) => row.join(','))
        .join('\n');
      this.service
        .updatefiles(this.fileids['engineoils'], csvContent)
        .subscribe((res) => {
          localStorage.removeItem(this.fileids['engineoils']);
        });

    } else {
      let perticularswritdata: any[][] = [];
      this.perticularoptons.forEach((element: any, index: any) => {
        perticularswritdata.push([element.name, element.balance]);
      });
      let csvContent = perticularswritdata
        .map((row: any) => row.join(','))
        .join('\n');
      this.service
        .updatefiles(this.fileids['perticulars'], csvContent)
        .subscribe((res) => {
          this.route.navigateByUrl('index')
          localStorage.removeItem(this.fileids['perticulars'])
        }, (err) => {
          console.log(err);
        });

    }

    this.display = false;
  }
  newrecord() {
    let data: any = { exist: false, balance: 0 }
    this.selected.push(data)
  }
  close() {
    this.display = false;
  }
  selectedincludecheck(str: any) {
    if (str === undefined) return true;
    return (str.toLowerCase()).includes(this.searchselected.toLowerCase())
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.route.navigateByUrl("login")
  }
}
