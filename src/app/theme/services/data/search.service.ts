import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {

    projectKeys: string[] = [];

    saveData(data:any) {
        data.forEach(element => {
            this.projectKeys.push(element.key);
        });
    }

    getData(): string[] {
        return this.projectKeys;
    }

}
