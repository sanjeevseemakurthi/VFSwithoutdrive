import { Component } from '@angular/core';
declare var gapi: any
declare global {
  interface Window { handleCredentialResponse: any; }
}
window.handleCredentialResponse = (response: any) => {

  console.log(response);
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VFSwithoutdrive';
  constructor() {
  }
  execute() {
    return gapi.client.drive.files.list({})
      .then(function (response: any) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
        function (err: any) { console.error("Execute error", err); });
  }
}

