export const DEFAULT_ALBUM_ART = 'assets/imgs/default.png';

export enum MopidyPlaybackState {
    Stopped = 'stopped',
    Playing = 'playing',
    Paused = 'paused'
}

export class MopidyState {
    playbackState: MopidyPlaybackState = MopidyPlaybackState.Stopped;
    trackSeekPos: number = 0;
    trackLength: number = 100;
    trackName: string = '';
    trackInfo: string = '';
    fileInfo: string = '';
    volume: number = 0;
    albumArt: string = DEFAULT_ALBUM_ART;
}

export class MopidyQueueItem {
    name: string = '';
    albumArt: string = DEFAULT_ALBUM_ART;
    trackInfo: string = '';
    tlid: number = -1;
    current: boolean = false;
}

export class MopidyBrowseState {
    backends: any[] = [];
    breadcrumb: string[] = [];
}