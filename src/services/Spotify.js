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
}

export default Spotify
