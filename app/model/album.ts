import {Track} from "./track";

export class Album {
    id:string;
    title:string;
    artistId:string;
    artistName:string;
    albumArt:string;
    year:number;
    tracks:Track[];
}
