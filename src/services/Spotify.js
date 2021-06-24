const { Lyrics } = require("spotify-lyrics-api")
import fetch from 'fetch';

class Spotify {
    constructor(authKey) {
        this.authKey = `Bearer ${authKey}`
        this.baseURL="https://api.spotify.com/v1"
        this.lyrics = new Lyrics(
            path.join(__dirname, 'cookies.txt')
        )
    }

    constructURL(extension) {
        return `${this.baseURL}/${extension}`
    }

    getPlaylistTrackIDs(playlistID) {
        extension = `playlists/${playlistID}`
        let url = this.constructURL(extension)
        const response = fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authKey
                },
            }
        )
        
        let trackIDs = []
        if (response.ok){
            let json = await response.json()
            let tracks = json["tracks"]["items"]
            for (let track in tracks) {
                track_id = track["track"]["id"]
                trackIDs.push(track_id)
            }
        } else {
            console.log(response.json())
        }
        return trackIDs
    }

    getTrackLyrics(trackIDs) {
        let lyricsData = await(this.lyrics.fromID(trackID))
        trackLyrics = []
        for (let line in lyricsData) {
            trackLyrics.push(line["words"])
        }
        return trackLyrics
    }

    getPlaylistLyrics(playlistID) {
        let trackIDs = this.getPlaylistTrackIDs(playlistID)
        playlistLyrics = []
        for (let trackID in trackIDs){
            playlistLyrics = playlistLyrics.concat(this.getTrackLyrics(trackID))
        }
        lyricCounts = {}
        for (let line in playlistLyrics) {
            // split by word
            let words = line["words"].split(' ')
            for (let word in words){
                // upcase and right-strip words of non-word characters, add to count
                word = word.toUpperCase().replace(/\W+\z/, '')
                if (lyricCounts[word]){
                    lyricCounts[word] += 1
                } else {
                    lyricCounts[word] = 1
                }
            }
        }
        return lyricCounts
    }
}

export default Spotify