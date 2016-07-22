import { Injectable, Inject } from '@angular/core';
import os = require("os");
import path = require("path");
import {Album} from "../model/album";
import async = require("async");
import {DownloadItem} from "../model/download";
import https = require("https");
import fs = require("fs");
import {YoutubeService, YoutubeServiceCallback} from "./youtube.service";
import * as ytdl from "ytdl-core";
import {IncomingMessage} from "http";
import {Track} from "../model/track";

class DownloadItemInternal implements YoutubeServiceCallback {
    constructor(public album: Album, public track: Track, public downloadService:DownloadService) {}

    youtubeCallback(audioUrl: string) {
        let tmpDir = path.join(this.downloadService.downloadDir, "temp");
        let file = fs.createWriteStream(path.join(tmpDir, this.track.title + ".m4a"));
        https.get(audioUrl, (res) => {
            console.log('statusCode: ', res.statusCode);
            console.log('headers: ', res.headers);

            res.on('data', (d) => {
                file.write(d);
            });

            res.on('close', () => {
                file.close();
            })

        }).on('error', (e) => {
            console.error(e);
        });
    }
}

@Injectable()
export class DownloadService {
    downloadDir: string;
    downloadQueue: AsyncQueue<DownloadItemInternal>;

    constructor(@Inject(YoutubeService) private youtubeService:YoutubeService) {
        let homeDir = os.homedir();
        this.downloadDir = path.join(homeDir, "Music/MusicTube");
        this.downloadQueue = async.queue(this.processDownloadRequest, 2);
    }

    addDownload(album: Album, track: Track) {
        let task = new DownloadItemInternal(album, track, this);
        console.log("Adding " + task + " to queue");
        this.downloadQueue.push(task, function(err:Error) {
            console.log("Download failed! " + err.message);
        });
    }

    processDownloadRequest(task: DownloadItemInternal, callback: ErrorCallback) {
        console.log("Starting download of " + task.album.name + " - " + task.track.title);
        // task.downloadService.youtubeService.getAudioUrl(task.track.youtubeLink, task);
        let tmpDir = path.join(task.downloadService.downloadDir, "temp");
        let filepath = path.join(tmpDir, task.track.title + ".m4a");
        task.downloadService.youtubeService.downloadAudio(task.track.youtubeLink, filepath);
        callback();
    }
}
