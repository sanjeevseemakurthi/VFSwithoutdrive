import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { forEach, cloneDeep as loadashclonedeep } from 'lodash';
import { ServicesService } from '../services.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  constructor(public formservice: ServicesService, public datePipe: DatePipe, private route: Router) { }
  readings = [];
  engineoils: any[] = [];
  perticulars: any[] = [];
  engineoilsearch = '';
  perticularsearch = '';
  displayedColumns = [
    'pump',
    'type',
    'closing',
    'opening',
    'testing',
    'totallts',
    'price',
    'cost',
  ];
  dataSource: any[] = [];
  engineoilsoptions: any;
  perticularoptons: any;
  totaloils = 0.0;
  totalengineoils = 0.0;
  leftovercash = 0.0;
  credit = 0.0;
  debit = 0.0;
  page = 1;
  daysheetdate: any = new Date();
  fileids: any = {};
  ngOnInit(): void {
    this.daysheetdate.setDate(this.daysheetdate.getDate() - 1);
    this.daysheetdate = this.datePipe.transform(this.daysheetdate, 'yyyy-MM-dd')
    this.formservice.getAllfiles().subscribe((res: any) => {
      let str = localStorage.getItem('files');
      res = JSON.parse(str ? str : '');
      res.files.forEach((res: any) => {
        let name = res.name.split('.')[0];
        let fileid = res.id;
        this.fileids[name] = fileid;
      });
      this.readExcelFile();
    });
  }
  readExcelFile() {
    this.formservice
      .readingfiles(this.fileids['readings'])
      .subscribe((data) => {
        let str = localStorage.getItem(this.fileids['readings']);
        let hold = JSON.parse(str ? str : '');
        let resultdata: any[] = [];
        hold.forEach((element: any) => {
          let row = {
            pump: element[0],
            opening: element[1],
            closing: '',
            type: element[2],
            price: element[3],
            testing: 5,
          };
          resultdata.push(row);
        });
        this.dataSource = resultdata;
        this.initialcaluclatins();
      });
    this.formservice
      .readingfiles(this.fileids['engineoils'])
      .subscribe((data) => {
        let str = localStorage.getItem(this.fileids['engineoils']);
        let hold = JSON.parse(str ? str : '');
        let resultdata: any[] = [];
        hold.forEach((element: any, index: number) => {
          let row = {
            name: element[0],
            qty: element[1],
            id: index,
          };
          resultdata.push(row);
        });
        this.engineoilsoptions = resultdata;
      });
    this.formservice
      .readingfiles(this.fileids['perticulars'])
      .subscribe((data) => {
        let str = localStorage.getItem(this.fileids['perticulars']);
        let hold = JSON.parse(str ? str : '');
        let resultdata: any[] = [];
        hold.forEach((element: any, index: number) => {
          let row = {
            name: element[0],
            balance: element[1],
            id: index,
          };
          resultdata.push(row);
        });
        this.perticularoptons = resultdata;
        if (sessionStorage.getItem('perticulars')) {
          let str = sessionStorage.getItem('perticulars');
          let hold = JSON.parse(str ? str : '');
          this.perticulars = loadashclonedeep(hold);
          this.perticularchage();
        } else {
          this.customperticulars();
        }

      });
    if (sessionStorage.getItem('readings')) {
      let str = sessionStorage.getItem('readings');
      let hold = JSON.parse(str ? str : '');
      this.dataSource = loadashclonedeep(hold);
      this.initialcaluclatins();
    }
    if (sessionStorage.getItem('engineoils')) {
      let str = sessionStorage.getItem('engineoils');
      let hold = JSON.parse(str ? str : '');
      this.engineoils = loadashclonedeep(hold);
      this.engineoilpricechange();
    }

  }
  // for readings row change
  readingrowchanged(element: any, item: string, row: number) {
    let result = this.dataSource;
    let index = element.pump - 1;
    this.totaloils = this.totaloils - parseFloat(result[index].cost);
    result[index].totallts =
      result[index].closing - result[index].opening - result[index].testing;
    result[index].cost = (result[index].totallts * result[index].price).toFixed(
      2
    );
    this.totaloils = this.totaloils + parseFloat(result[index].cost);
    this.perticulars[2].credit = parseFloat(this.totaloils.toFixed(2));
    document.getElementById(item + (row + 1))?.focus();
  }
  engineoilpricechange() {
    this.totalengineoils = 0;
    this.engineoils.forEach((element) => {
      this.totalengineoils = this.totalengineoils + element.price;
    });
    if (this.perticulars[1]) {
      this.perticulars[1].credit = parseFloat(this.totalengineoils.toFixed(2));
    }
  }
  perticularchage() {
    this.credit = 0;
    this.debit = 0;
    this.leftovercash = 0;
    this.perticulars.forEach((element) => {
      this.credit = this.credit + element.credit;
      this.debit = this.debit + element.debit;
    });
    this.leftovercash = this.credit - this.debit;
  }
  initialcaluclatins() {
    this.totaloils = 0;
    let result = this.dataSource;
    result.forEach((element) => {
      let index = element.pump - 1;
      result[index].totallts =
        result[index].closing - result[index].opening - result[index].testing;
      result[index].cost = (
        result[index].totallts * result[index].price
      ).toFixed(2);
      this.totaloils = parseFloat(result[index].cost) + this.totaloils;
    });
    this.dataSource = loadashclonedeep(result);
    this.totaloils = loadashclonedeep(this.totaloils);
  }

  customperticulars() {
    this.perticulars.push({
      name: this.perticularoptons[2].name,
      credit: this.perticularoptons[2].balance,
      debit: 0,
      id: 2,
      disable: true,
    });
    this.perticulars.push({
      name: this.perticularoptons[0].name,
      credit: this.totalengineoils,
      debit: 0,
      id: 0,
      disable: true,
    }),
      this.perticulars.push({
        name: this.perticularoptons[1].name,
        credit: this.totaloils,
        debit: 0,
        id: 1,
        disable: true,
      });
    this.perticularchage();
  }
  engineoilselected(event: any, index: any) {
    this.engineoils[index].name = event.value.name;
    this.engineoils[index].qty = 0;
    this.engineoils[index].price = 0;
    this.engineoils[index].id = event.value;
    this.engineoilsearch = '';
  }
  addengineoils() {
    for (let i = 0; i < this.page; i++) {
      this.engineoils.push({
        name: null,
        qty: 0,
        price: 0,
      });
    }
  }
  removeengineoil(index: any) {
    this.engineoils.splice(index, 1);
    this.engineoils = this.engineoils;
    this.engineoilpricechange();
  }
  perticularsselected(event: any, index: any) {
    this.perticulars[index].name = event.value.name;
    this.perticulars[index].credit = 0;
    this.perticulars[index].debit = 0;
    this.perticulars[index].id = event.value;
    this.perticularsearch = '';
  }
  clearall() {
    sessionStorage.clear();
    localStorage.removeItem(this.fileids['readings'])
    localStorage.removeItem(this.fileids['engineoils'])
    localStorage.removeItem(this.fileids['perticulars'])
    this.route.navigateByUrl("index")
  }
  addperticulars() {
    for (let i = 0; i < this.page; i++) {
      this.perticulars.push({
        name: null,
        credit: 0,
        debit: 0,
        disable: false,
        id: null,
      });
    }
  }
  removeperticular(index: any) {
    this.perticulars.splice(index, 1);
    this.perticulars = this.perticulars;
    this.perticularchage();
  }

  // submit things
  confirmsubmission() {
    if (confirm('Are u sure u want to submit')) {
      this.finalsubmit();
    }
  }
  saveasdraft() {
    sessionStorage.setItem('readings', JSON.stringify(this.dataSource));
    sessionStorage.setItem('engineoils', JSON.stringify(this.engineoils));
    sessionStorage.setItem('perticulars', JSON.stringify(this.perticulars));
    this.perticularchage();
    this.initialcaluclatins();
  }
  finalsubmit() {
    // readings write
    this.saveasdraft()
    this.formservice.refreshtoken().subscribe((res: any) => {
      localStorage.setItem('token', res.access_token)
    })
    let readingswritdata: any = [];
    this.dataSource.forEach((element: any) => {
      readingswritdata.push([
        element.pump,
        element.closing,
        element.type,
        element.price,
      ]);
    });
    let csvContent = readingswritdata
      .map((row: any) => row.join(','))
      .join('\n');
    this.formservice
      .updatefiles(this.fileids['readings'], csvContent)
      .subscribe((res) => {
        console.log('hi');
      });
    //engineoils write
    // need to reduce qty
    this.engineoils.forEach((element: any) => {
      this.engineoilsoptions[element.id].qty =
        this.engineoilsoptions[element.id].qty - element.qty;
    });
    let enginwoilsswritdata: any[][] = [];
    this.engineoilsoptions.forEach((element: any, index: any) => {
      enginwoilsswritdata.push([element.name, element.qty, index]);
    });
    csvContent = enginwoilsswritdata
      .map((row: any) => row.join(','))
      .join('\n');
    this.formservice
      .updatefiles(this.fileids['engineoils'], csvContent)
      .subscribe((res) => {
        console.log('hi');
      });
    //perticulars write
    //form day sheet
    let daysheet: any[][] = [];
    daysheet.push(["name", "credit", "debit"])
    this.perticulars.forEach((element: any, index: any) => {
      daysheet.push([this.perticularoptons[element.id].name, element.credit, element.debit]);
    });
    daysheet.push(['total', this.leftovercash, '']);
    csvContent = daysheet.map((row: any) => row.join(',')).join('\n');
    // test
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(daysheet)
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const file = new File([csvContent], 'data.csv,');
    const yesterdayString =
      this.datePipe.transform(this.daysheetdate, 'yyyy-MM-dd') + '.csv';
    this.formservice.createfile(file).subscribe((res: any) => {
      this.formservice
        .updatename(res.id, {
          name: yesterdayString,
          Type: 'Comma-separated values',
        })
        .subscribe((res: any) => {
          this.clearall();
        });
    });

    // need to change balance
    this.perticulars.forEach((element: any, index: number) => {
      this.perticularoptons[element.id].balance =
        this.perticularoptons[element.id].balance + element.debit - element.credit;
    });
    // for cash only
    this.perticularoptons[2].balance = this.leftovercash;

    let perticularswritdata: any[][] = [];
    this.perticularoptons.forEach((element: any, index: any) => {
      perticularswritdata.push([element.name, element.balance]);
    });
    csvContent = perticularswritdata
      .map((row: any) => row.join(','))
      .join('\n');
    this.formservice
      .updatefiles(this.fileids['perticulars'], csvContent)
      .subscribe((res) => {
        console.log('hi');
        this.route.navigateByUrl('index')
      });
  }
  engineoilsoptionsfilter(str: string) {
    return str.toLowerCase().includes(this.engineoilsearch.toLowerCase())
  }
  perticularoptonssearch(str: string) {
    return str.toLowerCase().includes(this.perticularsearch.toLowerCase())
  }
  focusonsearch() {
    document.getElementById("perticularid")?.focus()
  }
  focusonsearchengine() {
    document.getElementById("engineoilid")?.focus()
  }
  goback() {
    this.route.navigateByUrl("index")
  }
}
