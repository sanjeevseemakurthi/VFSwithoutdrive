import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  holdcreatedata: any;

  constructor(public http: HttpClient) { }
  authenricate() {
    return oauthSignIn();
  }


  getAllfiles() {
    let head = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }
    return this.http.get("https://www.googleapis.com/drive/v3/files", { headers: head })
  }
  readingfiles(file: string) {
    let head = {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    return this.http.get("https://www.googleapis.com/drive/v3/files/" + file + "?alt=media",
      {
        headers: head,
        responseType: 'arraybuffer'
      })
  }
  updatefiles(file: any, body: any) {
    let head = {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    return this.http.patch('https://www.googleapis.com/upload/drive/v3/files/' + file + '?uploadType=media', body, { headers: head });
  }
  createfile(data: any) {
    let head = {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    return this.http.post(" https://www.googleapis.com/upload/drive/v3/files?uploadType=media", data, { headers: head })
  }
  updatename(fileid: any, data: any) {
    let head = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': '.csv'
    }
    return this.http.patch("https://www.googleapis.com/drive/v3/files/" + fileid, data, { headers: head })
  }
  savefileindrive(arradydata: any, name: any) {
    let csvContent = arradydata
      .map((row: any) => row.join(','))
      .join('\n');
    this.createfile(csvContent)
      .subscribe((res: any) => {
        this.updatename(res.id, {
          name: name,
          Type: 'Comma-separated values',
        })
          .subscribe((res: any) => { });
      });
  }
  refreshtoken() {
    let data = {
      'client_id': "690642125705-caa0a1fncrf17apvt20mg545u9dmr6hq.apps.googleusercontent.com",
      'client_secret': "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",
      'refresh_token': localStorage.getItem('token'),
      'grant_type': 'refresh_token'
    }
    return this.http.post('https://oauth2.googleapis.com/token', data)
  }
}

// js code authenticate
function oauthSignIn(): void {
  const oauth2Endpoint: string = "https://accounts.google.com/o/oauth2/v2/auth";

  const form: HTMLFormElement = document.createElement("form");
  form.method = "GET"; // Send as a GET request.
  form.action = oauth2Endpoint;

  const params: Record<string, string> = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    response_type: "token",
    scope: "https://www.googleapis.com/auth/drive",
    include_granted_scopes: "true",
    state: "pass-through value",
  };

  for (const p of Object.keys(params)) {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "hidden";
    input.name = p;
    input.value = params[p];
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
