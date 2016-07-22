import { Injectable } from '@angular/core';
import * as ytdl from "ytdl-core";
import fs = require("fs");

export interface YoutubeServiceCallback {
    youtubeCallback(audioUrl: string): void;
}

@Injectable()
export class YoutubeService {
    constructor() {}

    getAudioUrl(youtubeLink: string, callback: YoutubeServiceCallback) {
        var options: ytdl.DownloadOptions = {
            filter: "audioonly"
        };
        var app = this;
        ytdl.getInfo("https://www.youtube.com/watch?v=" + youtubeLink, options, function (err:any, info:ytdl.VideoInfo) {
            for (var i = 0; i < info.formats.length; i++) {
                if (info.formats[i].type.startsWith("audio/mp4")) {
                    callback.youtubeCallback(info.formats[i].url);
                    break;
                }
            }
        });
    }

    downloadAudio(youtubeLink: string, filepath: string) {
        let options = {
            filter: function (format:ytdl.VideoFormat) {
                return format.type.startsWith("audio/mp4");
            }
        };
        ytdl("https://www.youtube.com/watch?v=" + youtubeLink, options).pipe(fs.createWriteStream(filepath));
    }
}
