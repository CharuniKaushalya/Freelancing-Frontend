import { Component, ViewContainerRef, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';
import { MyService } from "./theme/services/backend/service";

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
    providers: [MyService],
})
export class App implements OnInit {

    isMenuCollapsed: boolean = false;
    streams: string[] = ["projects", "contracts", "Users", "skills","user-skill","user-edu"];

    constructor(private _state: GlobalState,
        private _imageLoader: BaImageLoaderService,
        private _spinner: BaThemeSpinner,
        private viewContainerRef: ViewContainerRef,
        private themeConfig: BaThemeConfig,
        private _service: MyService) {

        themeConfig.config();

        this._loadImages();

        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    ngOnInit() {
        this.streams.forEach(stream => {
            this._service.listStreamItems(stream).then(data => {
                if (data.error) {
                    if (data.result == null) {
                        console.log("Not found Stream" + stream)
                        this._service.createStream(stream).then(streamData => {
                            console.log("created " + stream)
                        })
                        this._service.subscribeStream(stream).then(subsData => {
                            console.log("subscribed " + stream)
                        })
                    }
                }
            });
        });
    }

    public ngAfterViewInit(): void {
        // hide spinner once all loaders are completed
        BaThemePreloader.load().then((values) => {
            this._spinner.hide();
        });
    }

    private _loadImages(): void {
        // register some loaders
        BaThemePreloader.registerLoader(this._imageLoader.load('assets/img/sky-bg.jpg'));
    }

}
