import {Component, OnInit, NgZone} from '@angular/core';
import {Album} from "../model/album";
import {AlbumService} from "../service/album.service";
import {Track} from "../model/track";

@Component({
    selector: 'player',
    templateUrl: 'component/player.component.html',
    styleUrls: [ 'component/player.component.css' ],
    providers: [ AlbumService ]
})
export class PlayerComponent implements OnInit {
    album: Album;
    track: Track;
    errorMessage: string;

    constructor(private zone: NgZone, private albumService: AlbumService) {
    }

    ngOnInit() {
    }
}
