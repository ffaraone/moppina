import {
  DEFAULT_ALBUM_ART,
  MopidyPlaybackState,
  MopidyQueueItem,
  MopidyState
  } from '../../models/mopidy';
import { MopidyBrowseState } from '../../models/mopidy';
import { LastFmProvider } from '../last-fm/last-fm';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Env } from '@app/env';
import { Events } from 'ionic-angular';
import * as Mopidy from 'mopidy';


@Injectable()
export class MopidyProvider {

  state: MopidyState = new MopidyState();
  browseState: MopidyBrowseState = new MopidyBrowseState();
  queue: MopidyQueueItem[] = [];

  private mopidy: Mopidy;
  private updater: any;


  constructor(private http: HttpClient, private events: Events, private lastFM: LastFmProvider) {
    this.mopidy = new Mopidy({
      webSocketUrl: Env.mopidyWsUrl
    });
    this.configureEvents();
  }
  private configureEvents() {
    this.mopidy.on('state:offline', () => {
      this.events.publish('mopidy:connection:offline');
    });
    this.mopidy.on('state:online', () => {
      this.loadCurrentState();
    });
    this.mopidy.on('event:playbackStateChanged', (stateInfo) => this.updatePlaybackState(stateInfo));
    this.mopidy.on('event:volumeChanged', vol => this.state.volume = vol);
    this.mopidy.on('event:seeked', seekPosInfo => this.state.trackSeekPos = seekPosInfo.time_position);
    this.mopidy.on('event:trackPlaybackStarted', (data) => {
      this.updateTrackInfo(data.tl_track.track);
      this.updateQueuePointer(data.tl_track);
    });
    this.mopidy.on('event:tracklistChanged', () => this.updateQueue());
  }

  private loadCurrentState() {
    Promise.all(
      [
        this.mopidy.mixer.getVolume().then(vol => this.state.volume = vol),
        this.mopidy.playback.getState().then(state => this.state.playbackState = state),
        this.mopidy.playback.getCurrentTrack().then(track => this.updateTrackInfo(track)),
        this.mopidy.library.browse(null).then(refs => {
          this.browseState.backends = refs;
          this.updateBackendsIcon(refs);
        })
      ]
    ).then(() => {
      this.updateQueue();
      this.events.publish('mopidy:connection:online');
    })
  }
  private updateBackendsIcon(refs) {
    for (let ref of refs) {
      if (ref.uri.startsWith('spotify')) {
        ref.icon = 'custom-spotify';
      } else if (ref.uri.startsWith('dirble')) {
        ref.icon = 'md-radio';
      } else if (ref.uri.startsWith('tunein')) {
        ref.icon = 'custom-tunein';
      } else if (ref.uri.startsWith('podcast+file')) {
        ref.icon = 'custom-podcast';
      } else if (ref.uri.startsWith('podcast+itunes')) {
        ref.icon = 'custom-itunes';
      } else if (ref.uri.startsWith('file')) {
        ref.icon = 'custom-file-audio';
      } else {
        ref.icon = 'musical-notes';
      }
    }
  }
  private updatePlaybackState(stateInfo) {
    this.state.playbackState = stateInfo.new_state;
    if (stateInfo.new_state === MopidyPlaybackState.Playing) {
      this.startSeekPosUpdater();
    } else {
      this.stopSeekPosUpdater();
    }
    this.events.publish('mopidy:playback:stateChanged', stateInfo);
  }

  private updateTrackInfo(track) {
    if (!track) {
      this.state.trackLength = 100;
      this.state.trackSeekPos = 0;
      this.state.albumArt = DEFAULT_ALBUM_ART;
      return;      
    }
    this.state.trackLength = track.length;
    this.state.trackSeekPos = 0;
    this.state.trackName = track.name;
    this.state.trackInfo = this.getTrackInfo(track);
    this.getNowPlayingAlbumArt(track);
  }
  private getTrackInfo(track) {
    const info = [];
    const artist = this.getArtistName(track);
    if (artist) {
      info.push(artist);
    }
    if (track.album && track.album.name) {
      info.push(track.album.name);
    }
    return info.join(' - ');
  }
  private getArtistName(track) {
    if (track && track.artists && track.artists.length > 0) {
      return track.artists[0].name;
    }
    if (track && track.album && track.album.artists && track.album.artists.length > 0) {
        return track.album.artists[0].name;
    }
    return '';
  }
  private startSeekPosUpdater() {
    this.updater = setInterval(() => {
      this.mopidy.playback.getTimePosition().then((val) => {
        this.state.trackSeekPos = val;
      });
    }, 500);
  }
  private stopSeekPosUpdater() {
    if (this.updater) {
      clearInterval(this.updater);
    }
  }
  private getNowPlayingAlbumArt(track) {
    this.getAlbumArt(track).then(url => this.state.albumArt = url);
  }
  public getAlbumArt(track): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.mopidy.library.getImages([track.uri]).then((imageResults) => {
        for (const uri in imageResults) {
          if (imageResults[uri].length > 0) {
            resolve(imageResults[uri][0]['uri']);
            return;
          }
        }
        this.lastFM.getAlbumArt(track)
          .then(res => resolve(res))
          .catch(() => resolve(DEFAULT_ALBUM_ART));
      });
    });
  }

  public getAlbumArts(uris): Promise<any> {
    return this.http.post('http://mophile.velasuci.com:6680/moppina/api/', uris).toPromise();
  }

  public getArtistPicture(artist): Promise<string> {
    return this.lastFM.getArtistPicture(artist);
  }
  playPause() {
    if (this.state.playbackState === MopidyPlaybackState.Playing) {
      this.mopidy.playback.pause();
    } else {
      this.mopidy.playback.play();
    }
  }
  next() {
    this.mopidy.playback.next();
  }
  previous() {
    this.mopidy.playback.previous();
  }
  setVolume() {
    this.mopidy.mixer.setVolume(this.state.volume);
  }
  seek() {
    this.mopidy.playback.seek(this.state.trackSeekPos);
  }
  updateQueue() {
    this.mopidy.tracklist.getTlTracks().then(tlTracks => {
      this.queue = [];
      for (const tlTrack of tlTracks) {
        const queueItem: MopidyQueueItem = new MopidyQueueItem();
        queueItem.name = tlTrack.track.name;
        queueItem.trackInfo = this.getTrackInfo(tlTrack.track.name);
        queueItem.tlid = tlTrack.tlid;
        this.queue.push(queueItem);  
      }
      this.mopidy.playback.getCurrentTlTrack().then(tlTrack => this.updateQueuePointer(tlTrack));
      this.getQueueAlbumArt(tlTracks);
    });
  }
  private updateQueuePointer(tlTrack) {
    if (tlTrack) {
      for (const qi of this.queue) {
        qi.current = tlTrack.tlid === qi.tlid
      }
    }
  }

  private getQueueAlbumArt(tlTracks): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      for (const tlTrack of tlTracks) {
        this.getAlbumArt(tlTrack.track).then(url => {
          for (const qi of this.queue) {
            if(qi.tlid == tlTrack.tlid) {
              qi.albumArt = url;
              break;
            }
          }
        });
      }
    });
  }
  playQueueTrack(qi) {
    this.mopidy.playback.play(null, qi.tlid);
  }
  reorderQueue(indexes) {
    this.mopidy.tracklist.move(indexes.from, indexes.from, indexes.to);
  }
  clearQueue() {
    this.mopidy.tracklist.clear();
  }
  shuffleQueue() {
    this.mopidy.tracklist.shuffle();
  }
  browse(uri): Promise<any[]> {
    return this.mopidy.library.browse(uri);
  }
  appendQueue(uri) {
    this.mopidy.tracklist.add(null, null, uri);
  }
  clearAndPlayQueue(uri) {
    this.mopidy.tracklist.clear().then(() => {
      this.mopidy.tracklist.add(null, null, uri).then(() => {
        this.mopidy.playback.play(null, 0);
      })
    });
  }
  appendAndPlay(uri) {
    this.mopidy.tracklist.add(null, null, uri).then((tltracks) => {
      this.mopidy.playback.play(null, tltracks[0].tlid);
    });
  }
  lookup(uri): Promise<any[]> {
    return this.mopidy.library.lookup(uri);
  }
  search(query) {
    console.log(this.mopidy.audio);
    return this.mopidy.library.search({'albumartist': [query]}, ['local:'], true)
  }
}
