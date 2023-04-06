import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(public http:HttpClient) { }
  readingscall(file: string) {
    return this.http.get('assets/'+ file + '.xlsx', { responseType: 'arraybuffer' });
  }
}
