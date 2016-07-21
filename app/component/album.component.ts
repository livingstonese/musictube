import {Component, OnInit, NgZone} from '@angular/core';
import {Album} from "../model/album";
import {AlbumService} from "../service/album.service";
import {Track} from "../model/track";

@Component({
    selector: 'album',
    templateUrl: 'component/album.component.html',
    styleUrls: [ 'component/album.component.css' ],
    providers: [ AlbumService ]
})
export class AlbumComponent implements OnInit {
    album: Album;
    tracks: Track[];
    errorMessage: string;

    constructor(private zone: NgZone, private albumService: AlbumService) {
    }

    ngOnInit() {
        this.getTracks();
    }

    getTracks() {
        this.albumService.getTracks("2263135", "118522").subscribe(
            tracks => this.zone.run(() => this.tracks = tracks),
            error => this.errorMessage = <any>error
        );
    }

    getTrackDuration(strDuration: string): string {
        var duration = parseInt(strDuration);
        var totalsecs = duration / 1000;
        var mins = Math.floor(totalsecs / 60);
        var secs = totalsecs % 60;
        var strSecs = secs < 10 ? `0${secs}` : `${secs}`;
        var ret = `${mins}:${strSecs}`;
        return ret;
    }
}
