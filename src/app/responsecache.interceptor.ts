import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ResponsecacheInterceptor implements HttpInterceptor {

  constructor(public route: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          if (request.url.includes('files/') && !request.url.includes('upload/')) {
            let keyname = request.url.split('files/')[1].replace('?alt=media', '')
            if (!localStorage.getItem(keyname)) {
              const workbook = XLSX.read(event.body, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              localStorage.setItem(keyname, JSON.stringify(excelData))
            }
          } else if (request.url.includes('files') && !request.url.includes('upload/')) {
            localStorage.setItem('files', JSON.stringify(event.body))
          }
        }
      }, err => {
        if (err.status === 401) {
          alert("Session time out Loggin Again");
          localStorage.clear();
          this.route.navigateByUrl('login')
        }
      })
    )
  }
}
