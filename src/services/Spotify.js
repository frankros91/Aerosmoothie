class Spotify {
    constructor(authKey) {
        this.authKey = `Bearer ${authKey}`
        this.baseURL="https://api.spotify.com/v1"
    }

    constructURL(extension) {
        return `${this.baseURL}/${extension}`
    }

    async getPlaylistTracks(playlistID) {
        const extension = `playlists/${playlistID}`
        const url = this.constructURL(extension)
        const response = await fetch(
            url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.authKey,
                }
            }
        )
        
        let tracks = []
        if (response.ok){
            let json = await response.json()
            tracks = json["tracks"]["items"]
        } else {
            console.log(await response.json())
        }
        return tracks
    }

    async getTrackFeatures(trackList) {
        const extension = `audio-features?ids=${trackList.join(',')}`
        const url = this.constructURL(extension)
        const response = await fetch(
            url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.authKey,
                }
            }
        )
        const responseData = await response.json()
        const validFeatures = [
            'acousticness',
            'danceability',
            'energy',
            'instrumentalness',
            'liveness',
            'loudness',
            'speechiness',
            'valence'
        ]
        let featureList = []
        for (let row in responseData.audio_features){
            let features = {}
            for (let feature in responseData.audio_features[row]){
                if (validFeatures.includes(feature)) {
                    if (responseData.audio_features[row][feature] <= 0.0){
                        responseData.audio_features[row][feature] = 0.0
                    } else if (responseData.audio_features[row][feature] > 1.0){
                        while (responseData.audio_features[row][feature] > 1.0){
                            responseData.audio_features[row][feature] /= 10
                        }
                    }
                    features[feature] = responseData.audio_features[row][feature]
                }
            }
            featureList.push({data: features, meta: {color: 'blue'}})
        }
        return featureList
    }

    async compileTrackFeatures(tracks){
        // const tracks = await this.getPlaylistTracks(playlistID)
        const trackIDs = tracks.map(track => track.id)
        const trackFeatures = await this.getTrackFeatures(trackIDs)
        return trackFeatures
    }

    async getUserTrackIds() {
        const url = this.constructURL('me/top/tracks')
        const result = await fetch(
            url,
            {
                method: 'GET',
                mode: 'cors',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': this.authKey 
                }
            }
        )
        const data = await result.json()
        console.log(data)
        return data.items
    }
}

export default Spotify
