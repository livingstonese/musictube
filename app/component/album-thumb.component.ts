import {Component, Input} from '@angular/core';
import {Album} from "../model/album";
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'album-thumb',
    templateUrl: 'component/album-thumb.component.html',
    styleUrls: [ 'component/album-thumb.component.css' ],
    directives: [ ROUTER_DIRECTIVES ]
})
export class AlbumThumbComponent {
    @Input()
    album: Album;
}
