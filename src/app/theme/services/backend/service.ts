import { Injectable } from '@angular/core';
import {Http, Response, URLSearchParams, Headers} from "@angular/http";

import { Observable } from 'rxjs/Rx';

import { Payload } from "../models/payload";

import 'rxjs/add/operator/toPromise';
import {environment} from "../../environments/environment";

@Injectable()
export class MyService {

    private baseUrl;
    private user="multichainrpc";
    private pass="4zztwXfBEUfga6uGQVUFiqSqsSdEEKjsPrXXhZd86xkD";

    constructor(private http:Http) {
      this.baseUrl = "http://127.0.0.1:5000/";
    }

    getinfo():Promise<any> {
        return this.callAPI('getinfo','get',null,null,null);
    }

    getpeerinfo():Promise<any> {
        return this.callAPI('getpeerinfo','get',null,null,null);
    }

    getaddresses():Promise<any> {
        return this.callAPI('getaddresses','get',null,null,null);
    }

    listpermissions(permissions: any ,addresses : any):Promise<any> {
        let params:URLSearchParams = new URLSearchParams();
        if (permissions){
            params.set( 'permissions' , permissions);
        }
        if (addresses){
            params.set( 'addresses' , addresses);  
        }      
        return this.callAPI('listpermissions','get',params,null,null);
    }

    getaddressbalances(address : string):Promise<any> {
        let params:URLSearchParams = new URLSearchParams();
        params.set( 'address' , address);
        return this.callAPI('getaddressbalances','get',params,null,null);
    }

    liststreams():Promise<any> {
        return this.callAPI('liststreams','get',null,null,null);
    }

    createStream(address : string, stream : string):Promise<any> {
        let params:URLSearchParams = new URLSearchParams();
        params.set( 'from_address' , address);
        params.set( 'name' , name);
        return this.callAPI('createfrom','get',params,null,null);
    }

    publishToStream(stream : string, key : string, data_hex:string):Promise<any> {
        let params:URLSearchParams = new URLSearchParams();
        params.set( 'stream' , stream);
        params.set( 'key' , key);
        params.set( 'data_hex' , data_hex);        
        return this.callAPI('publish','get',params,null,null);
    }

    listStreamItems(stream : string):Promise<any> {
        let params:URLSearchParams = new URLSearchParams();
        params.set( 'stream' , stream);       
        return this.callAPI('liststreamitems','get',params,null,null);
    }

    getstreamitem(stream : string,txid:string):Promise<any> {
        let params:URLSearchParams = new URLSearchParams();
        params.set( 'stream' , stream); 
        params.set( 'txid' , txid);                     
        return this.callAPI('getstreamitem','get',params,null,null);
    }
    
    callAPI(url: string, httpMethod: string, params: URLSearchParams, headers: Headers, body: string) : Promise<any>{
        switch (httpMethod) {

            case 'get':
                return this.http.get(this.baseUrl+url, {search: params}).toPromise()
                  .then(response => response.json())
                  .catch((error: Error) => console.log(error));

            case 'post':
                return this.http.post(this.baseUrl + url, body, {
                headers: headers,
                search: params
                }).toPromise().then(response => response.json())
                .catch((error: Error) => console.log(error));

            case 'put':
                return this.http.put(url, body, {
                headers: headers,
                search: params
                }).toPromise()
                .catch((error: Error) => console.log(error));

            case 'delete':
                return this.http.delete(url, {search: params}).toPromise()
                  .catch((error: Error) => console.log(error));

            default:
                throw new Error('Unsupported http method');

        }
  }

  private handleError(error: any) {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
    }
}
