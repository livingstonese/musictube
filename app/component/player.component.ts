import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import {Album} from "../model/album";
import {AlbumService} from "../service/album.service";
import {Track} from "../model/track";
import {TrackListener, PlayerService} from "../service/player.service";
import {YoutubeService, YoutubeServiceCallback} from "../service/youtube.service";

@Component({
    selector: 'player',
    templateUrl: 'component/player.component.html',
    styleUrls: [ 'component/player.component.css' ],
    providers: [ AlbumService ]
})
export class PlayerComponent implements OnInit, TrackListener, YoutubeServiceCallback {
    album: Album;
    track: Track;
    errorMessage: string;
    @ViewChild('audioPlayer')
    audioPlayer: any;
    @ViewChild('audioSource')
    audioSource: any;
    isPlaying: boolean;

    constructor(private zone: NgZone, private playerService: PlayerService, private youtubeService: YoutubeService) {
    }

    ngOnInit() {
        this.playerService.registerListener(this);
    }

    youtubeCallback(url) {
        this.isPlaying = false;
        this.audioPlayer.nativeElement.pause();
        this.audioSource.nativeElement.src = url;
        this.audioPlayer.nativeElement.load();
        this.audioPlayer.nativeElement.play();
        this.isPlaying = true;
    }

    playTrack(album: Album, track: Track): void {
        this.album = album;
        this.track = track;
        this.youtubeService.getAudioUrl(track.youtubeLink, this);
    }

    pause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.audioPlayer.nativeElement.pause();
        }
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.audioPlayer.nativeElement.play();
        }
    }
}
