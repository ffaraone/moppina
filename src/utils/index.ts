export function getArtistName(track) {
    if (track && track.artists && track.artists.length > 0) {
        return track.artists[0].name;
    }
    if (track && track.album && track.album.artists && track.album.artists.length > 0) {
        return track.album.artists[0].name;
    }
    return '';
}

export function getTrackCodec(uri) {
    if (uri && uri.startsWith('file://')) {
        const idx = uri.lastIndexOf('.');
        return uri.substring(idx + 1);
    }
    return 'stream';
}
