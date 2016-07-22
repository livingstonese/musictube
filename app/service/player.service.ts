import { Injectable } from '@angular/core';

import { Album } from '../model/album';
import { Track } from '../model/track';
import '../util/rxjs-operators';

export interface TrackListener {
    playTrack(album: Album, track: Track): void;
}

@Injectable()
export class PlayerService {
    private album: Album;
    private track: Track;
    private listeners: Array<TrackListener>;

    constructor () {
        this.listeners = [];
    }

    playTrack(album: Album, track: Track) {
        this.album = album;
        this.track = track;
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i].playTrack(album, track);
        }
    }

    playAlbum(album: Album) {
        
    }

    registerListener(listener: TrackListener) {
        this.listeners.push(listener);
    }
}
