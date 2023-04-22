import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('files/')) {
      let keyname = request.url.split('files/')[1].replace('?alt=media', '')
      if (localStorage.getItem(keyname)) {
        return of(new HttpResponse({ body: new ArrayBuffer(8) }));
      }
    } else if (request.url.includes('files')) {
      if (localStorage.getItem('files')) {
        return of(new HttpResponse({ body: [] }));
      }
    }

    return next.handle(request);
  }

}
