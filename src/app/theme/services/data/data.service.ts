import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core'
import {Contract} from "../../../theme/models/contract";

@Injectable()
export class DataService {
    sharingData: Contract = new Contract();

    saveData(contract) {
        this.sharingData = contract;
    }

    getData(): Contract {
        console.log('get data function called');
        return this.sharingData;
    }
}