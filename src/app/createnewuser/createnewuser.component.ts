import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-createnewuser',
  templateUrl: './createnewuser.component.html',
  styleUrls: ['./createnewuser.component.css']
})
export class CreatenewuserComponent implements OnInit {

  constructor(public services: ServicesService) { }

  ngOnInit(): void {
  }
  datatoupload: any = {}
  createReadingsfile() {
    const data = [
      ['pumpno', 'openingreadings', 'type', 'rate'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'readings.xlsx');
  }
  createEngineoils() {
    const data = [
      ['oilname', 'qty'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'engineoils.xlsx');
  }
  createPerticular() {
    const data = [
      ['oilname', 'qty'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'perticulars.xlsx');
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file.name)
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      const workbook = XLSX.read(fileData, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(data);
      this.datatoupload[file.name.split('.')[0]] = data;
    }
    reader.readAsBinaryString(file);
  }
  authenticate() {
    this.services.holdcreatedata = this.datatoupload
    this.services.authenricate();
  }
}
