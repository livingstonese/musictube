import {Component, OnInit, NgZone, OnDestroy} from '@angular/core';
import {Album} from "../model/album";
import {AlbumService} from "../service/album.service";
import {Track} from "../model/track";
import { ActivatedRoute } from '@angular/router';
import {Subscription} from "rxjs/Subscription";
import {PlayerService} from "../service/player.service";
import {DownloadService} from "../service/download.service";
import path = require("path");
import fs = require("fs");
import {YoutubeService} from "../service/youtube.service";
import ffmpeg = require('fluent-ffmpeg');

@Component({
    selector: 'album',
    templateUrl: 'component/album.component.html',
    styleUrls: [ 'component/album.component.css' ],
    providers: [ AlbumService, DownloadService ]
})
export class AlbumComponent implements OnInit {
    album: Album;
    errorMessage: string;
    sub: Subscription;

    constructor(private zone: NgZone, private albumService: AlbumService, private route: ActivatedRoute,
                private playerService: PlayerService, private downloadService: DownloadService) {
    }

    playTrack(track: Track): void {
        this.playerService.playTrack(this.album, track);
    }

    ngOnInit() {
        this.getTracks();
    }

    getTracks() {
        this.sub = this.route.params.subscribe(params => {
            let albumId = params['albumId'];
            let artistId = params['artistId'];
            
            this.albumService.getTracks(albumId, artistId)
                .subscribe(
                    album => this.zone.run(() => this.album = album),
                    error => this.errorMessage = <any>error
                );
        });

        // this.albumService.getTracks("2263135", "118522").subscribe(
        //     tracks => this.zone.run(() => this.tracks = tracks),
        //     error => this.errorMessage = <any>error
        // );
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getTrackDuration(strDuration: string): string {
        var duration = parseInt(strDuration);
        var totalsecs = duration / 1000;
        if (totalsecs == 0) {
            return '';
        }
        var mins = Math.floor(totalsecs / 60);
        var secs = Math.floor(totalsecs % 60);
        var strSecs = secs < 10 ? `0${secs}` : `${secs}`;
        var ret = `${mins}:${strSecs}`;
        return ret;
    }
}
