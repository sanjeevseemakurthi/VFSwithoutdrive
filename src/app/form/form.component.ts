import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { forEach, cloneDeep as loadashclonedeep } from 'lodash';
import { ServicesService } from '../services.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  constructor(public formservice: ServicesService, public datePipe: DatePipe) { }
  readings = [];
  engineoils: any[] = [];
  perticulars: any[] = [];
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
  daysheetdate = new Date();
  fileids: any = {};
  ngOnInit(): void {
    this.daysheetdate.setDate(this.daysheetdate.getDate() - 1);
    this.formservice.getAllfiles().subscribe((res: any) => {
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
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let hold = excelData;
        let resultdata: any[] = [];
        hold.forEach((element: any) => {
          let row = {
            pump: element[0],
            opening: element[1],
            closing: element[1],
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
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let hold = excelData;
        let resultdata: any[] = [];
        hold.forEach((element: any) => {
          let row = {
            name: element[0],
            qty: element[1],
            id: element[2],
          };
          resultdata.push(row);
        });
        this.engineoilsoptions = resultdata;
      });
    this.formservice
      .readingfiles(this.fileids['perticulars'])
      .subscribe((data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let hold = excelData;
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
        this.customperticulars();
      });
  }
  // for readings row change
  readingrowchanged(element: any) {
    let result = this.dataSource;
    let index = element.pump - 1;
    this.totaloils = this.totaloils - parseFloat(result[index].cost);
    result[index].totallts =
      result[index].closing - result[index].opening - result[index].testing;
    result[index].cost = (result[index].totallts * result[index].price).toFixed(
      2
    );
    this.totaloils = this.totaloils + parseFloat(result[index].cost);
    this.perticulars[2].credit = this.totaloils;
  }
  engineoilpricechange() {
    this.totalengineoils = 0;
    this.engineoils.forEach((element) => {
      this.totalengineoils = this.totalengineoils + element.price;
    });
    this.perticulars[1].credit = this.totalengineoils;
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
    this.engineoils[index].id = event.id;
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
    this.perticulars[index].id = null;
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
  finalsubmit() {
    // readings write
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
    this.perticulars.forEach((element: any, index: any) => {
      daysheet.push([element.name, element.credit, element.debit]);
    });
    daysheet.push(['', this.leftovercash, '']);
    csvContent = daysheet.map((row: any) => row.join(',')).join('\n');
    const file = new File([csvContent], 'data.csv,');
    const yesterdayString =
      this.datePipe.transform(this.daysheetdate, 'yyyy-MM-dd') + '.csv';
    this.formservice.createfile(file).subscribe((res: any) => {
      this.formservice
        .updatename(res.id, {
          name: yesterdayString,
          Type: 'Comma-separated values',
        })
        .subscribe((res: any) => { });
    });

    // need to change balance
    this.perticulars.forEach((element: any, index: number) => {
      this.perticularoptons[element.id] =
        element.balance + element.debit - element.credit;
    });
    // for cash only
    this.perticularoptons[3].balance = this.leftovercash;

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
      });
  }
}
