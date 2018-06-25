import { getArtistName } from '../../utils/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the LastFmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const API_KEY: string = 'd766f7c820cd47404b325ab3e5c4fe0a';
// const API_SECRET: string = '92d05c80976cb536d4e856b4df321409';

@Injectable()
export class LastFmProvider {



  constructor(public http: HttpClient) {
  }

  getAlbumArt(track: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let params: HttpParams = new HttpParams();
      params = params.set('api_key', API_KEY);
      params = params.set('method', 'album.getinfo');
      params = params.set('format', 'json');
      params = params.set('artist', getArtistName(track));
      params = params.set('album', track.album.name);
      this.http.get('http://ws.audioscrobbler.com/2.0/', {
        params: params
      }).subscribe(
        (data: any) => {
          if (data.album && data.album.image) {
            for (const img of data.album.image) {
              if (img.size === 'extralarge' || img.size === 'mega' || img.size === '') {
                resolve(img['#text']);
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
  }
}
