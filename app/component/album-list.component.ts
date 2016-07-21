import {Component, OnInit, NgZone} from '@angular/core';
import {MaterializeDirective} from "angular2-materialize";
import * as ytdl from "ytdl-core";
import {Album} from "../model/album";
import {AlbumService} from "../service/album.service"
import {AlbumThumbComponent} from "./album-thumb.component"

@Component({
    selector: 'album-list',
    templateUrl: 'component/album-list.component.html',
    styleUrls: [ 'component/album-list.component.css' ],
    directives: [ MaterializeDirective, AlbumThumbComponent ],
    providers: [ AlbumService ]
})
export class AlbumListComponent implements OnInit {
    albums: Album[];
    errorMessage: string;

    constructor(private zone: NgZone, private albumService: AlbumService) {
    }

    getAlbums() {
        this.albumService.getAlbums().subscribe(
            albums => this.zone.run(() => this.albums = albums),
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {
        this.getAlbums();
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