import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Album } from '../model/album';
import { Track } from '../model/track';
import { Observable } from 'rxjs/Observable';
import '../util/rxjs-operators';

@Injectable()
export class AlbumService {
    constructor (private http: Http) {}

    private albumsUrl = "https://rawgit.com/livingstonese/musictube-data/master/albums.json";
    private sampleTracksUrl = "https://rawgit.com/livingstonese/musictube-data/master/tracks/<artist id>/<album id>.json";

    getAlbums() : Observable<Album[]> {
        return this.http.get(this.albumsUrl).map(this.extractData).catch(this.handleError)
    }

    getTracks(albumId: string, artistId: string) : Observable<Album> {
        let tracksUrl = `https://rawgit.com/livingstonese/musictube-data/master/tracks/${artistId}/${albumId}.json`;
        return this.http.get(tracksUrl).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
