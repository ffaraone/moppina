import { getArtistName } from '../../utils/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';

/*
  Generated class for the LastFmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const API_KEY: string = 'd766f7c820cd47404b325ab3e5c4fe0a';
// const API_SECRET: string = '92d05c80976cb536d4e856b4df321409';

@Injectable()
export class LastFmProvider {



  constructor(
    private http: HttpClient, 
    private storage: Storage) {
  }

  getArtistPicture(artist:string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const key: string = Md5.hashAsciiStr(artist) as string;
      this.storage.get(key)
        .then((val) => {
          if (val) {
            resolve(val);
            return;
          }
          let params: HttpParams = new HttpParams();
          params = params.set('api_key', API_KEY);
          params = params.set('method', 'artist.getinfo');
          params = params.set('format', 'json');
          params = params.set('artist', artist);
          this.http.get('http://ws.audioscrobbler.com/2.0/', {
            params: params
          }).subscribe(
            (data: any) => {
              if (data.artist && data.artist.image) {
                for (const img of data.artist.image) {
                  if (img.size === 'extralarge' || img.size === 'mega' || img.size === '') {
                    const imgUrl = img['#text'];
                    this.storage.set(key, imgUrl);
                    resolve(imgUrl);
                  }
                }
              }
              reject('no image found');
            },
            (err) => {
              reject(err);
            }
          );
        });
    });
  }

  getAlbumArt(track: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const artist = getArtistName(track);
      const album = track.album ? track.album.name : '';
      if (!artist || !album) {
        reject('not enough data');
      }
      const key: string = Md5.hashStr(artist + album) as string;
      this.storage.get(key)
        .then((val) => {
          if (val) {
            resolve(val);
            return;
          }
          let params: HttpParams = new HttpParams();
          params = params.set('api_key', API_KEY);
          params = params.set('method', 'album.getinfo');
          params = params.set('format', 'json');
          params = params.set('artist', artist);
          params = params.set('album', album);
          this.http.get('http://ws.audioscrobbler.com/2.0/', {
            params: params
          }).subscribe(
            (data: any) => {
              if (data.album && data.album.image) {
                for (const img of data.album.image) {
                  if (img.size === 'extralarge' || img.size === 'mega' || img.size === '') {
                    const imgUrl = img['#text'];
                    this.storage.set(key, imgUrl);
                    resolve(imgUrl);
                  }
                }
              }
              reject('no image found');
            },
            (err) => {
              reject(err);
            }
          );
        });
    });
  }
}
