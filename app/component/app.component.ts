import {Component, OnInit, NgZone} from '@angular/core';
import {MaterializeDirective} from "angular2-materialize";
import * as ytdl from "ytdl-core";
import {AlbumService} from "../service/album.service"
import {AlbumListComponent} from "./album-list.component"
import {AlbumComponent} from "./album.component";
import {PlayerComponent} from "./player.component";

@Component({
    selector: 'app',
    templateUrl: 'component/app.component.html',
    styleUrls: [ 'component/app.component.css' ],
    directives: [ MaterializeDirective, AlbumListComponent, AlbumComponent, PlayerComponent ],
    providers: [ AlbumService ]
})
export class App implements OnInit {
    errorMessage: string;

    constructor(private zone: NgZone, private albumService: AlbumService) {
    }

    ngOnInit() {
    }

    /*ngOnInit() {
        var options: ytdl.DownloadOptions = {
            filter: "audioonly"
        };
        var app = this;
        ytdl.getInfo("https://www.youtube.com/watch?v=LdS69lNIBlI", options, function (err:any, info:ytdl.VideoInfo) {
            app.zone.run(function () {
                app.url = info.formats.filter(function(format) { return format.type.startsWith("audio/mp4");})[0].url;
            })
        });
    }*/

}