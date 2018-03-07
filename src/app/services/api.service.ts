import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private httpClient:HttpClient) {}

  /*getProfile() {
    this.httpClient.get(`https://my-json-server.typicode.com/techsithgit/json-faker-directory/profiles/?name=${this.name}`)
    .subscribe(
      (data:any[]) => {
        if(data.length) {
          this.age = data[0].age;
          this.found = true;
        }
      }
    )
  }*/

  private getToken(): string {
    return localStorage.getItem('yljwt');
  };
  // { headers: { Authorization: `Bearer ${this.getToken()}` }}

  signin(credential, onSuccess) {
    this.httpClient.post('/api/json/signin', credential)
    .subscribe(
      (res:any) => {
        if(res && res.success && res.data && res.data.token) {
          onSuccess(res.data);
          return;
        } else {
          // handle error logic
          console.log(res.reason);
          console.log("Error logic -- need to implement");
          return;
        }
      }, (error: any) => {
        console.log("Catch Error logic -- need to implement" + error);
        return;
      }
    )
  };


}
