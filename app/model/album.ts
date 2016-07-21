import {Track} from "./track";

export class Album {
    id:string;
    name:string;
    artistId:string;
    artist:string;
    albumArt:string;
    year:number;
    tracks:Track[];
}
