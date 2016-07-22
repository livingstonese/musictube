import { Injectable, Inject } from '@angular/core';
import os = require("os");
import path = require("path");
import {Album} from "../model/album";
import async = require("async");
import {DownloadItem} from "../model/download";
import https = require("https");
import http = require("http");
import fs = require("fs");
import {YoutubeService, YoutubeServiceCallback} from "./youtube.service";
import * as ytdl from "ytdl-core";
import {IncomingMessage} from "http";
import {Track} from "../model/track";
import ffmpeg = require("fluent-ffmpeg");
// import request = require("request");
import nodeID3 = require('node-id3');

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

            res.on('end', () => {
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
        this.downloadQueue.push(task, function (err:any) {
            console.log("Failed with err " + err);
        })
    }

    addAlbumDownload(album: Album) {
        for (let track of album.tracks) {
            let task = new DownloadItemInternal(album, track, this);
            this.downloadQueue.push(task, function (err:any) {
                if (err) {
                    console.log("Failed to add album " + err);
                }
            })
        }
    }

    download(uri: string, filename: string, callback: ()=>void){
        var file = fs.createWriteStream(filename);
        http.get(uri , (res) => {
            console.log('statusCode: ', res.statusCode);
            console.log('headers: ', res.headers);

            res.on('data', (d) => {
                file.write(d);
            });

            res.on('end', () => {
                file.close();
                callback();
            })

        }).on('error', (e) => {
            console.error("Failed to download " + uri);
            console.error(e);
        });
    }

    processDownloadRequest(task: DownloadItemInternal, callback: ErrorCallback) {
        console.log("Starting download of " + task.album.name + " - " + task.track.title);
        // task.downloadService.youtubeService.getAudioUrl(task.track.youtubeLink, task);
        let tmpDir = path.join(task.downloadService.downloadDir, "temp");
        let tempFilePath = path.join(tmpDir, task.track.title + ".m4a");
        let tempFileWriteStream = task.downloadService.youtubeService.downloadAudio(task.track.youtubeLink, tempFilePath);
        tempFileWriteStream.on('finish', () => {
            var dir = path.join(task.downloadService.downloadDir, task.album.artist);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            dir = path.join(dir, task.album.name);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var filePath = path.join(dir, task.track.title + ".mp3");
            var albumArtPath = path.join(dir, "album.jpg");
            task.downloadService.download(task.album.albumArt, albumArtPath, () => {
                console.log("Saved album art for " + task.album.name);
                ffmpeg(tempFilePath)
                    .audioCodec('libmp3lame')
                    .audioBitrate('128k')
                    .output(filePath)
                    .on('start', function(command) {console.log('Start: ', command);})
                    .on('error', function(err) {console.log('An error occurred: ' + err.message);})
                    .on('end', function(stdout, stderr) {
                        console.log("Finished writing " + filePath);
                        fs.unlink(tempFilePath, () => {
                            console.log("Deleted " + tempFilePath);
                            var tags = {
                                title: task.track.title,
                                artist: task.album.artist,
                                album: task.album.name,
                                composer: task.album.artist,
                                image: albumArtPath,
                                trackNumber: task.track.trackNumber
                            };
                            var success = nodeID3.write(tags, filePath);
                            if (success) {
                                console.log("Written ID3 tags successfully.")
                            } else {
                                console.log("Failed to write ID3 tags.")
                            }
                            callback();
                        });
                    }).run();
            });
        });
    }
}
