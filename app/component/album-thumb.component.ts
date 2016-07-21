import {Component, Input} from '@angular/core';
import {Album} from "../model/album";

@Component({
    selector: 'album-thumb',
    templateUrl: 'component/album-thumb.component.html',
    styleUrls: [ 'component/album-thumb.component.css' ],
})
export class AlbumThumbComponent {
    @Input()
    album: Album;
}
