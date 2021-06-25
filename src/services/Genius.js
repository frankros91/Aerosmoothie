// import { getLyrics, getSong } from 'genius-lyrics-api'
// const cio = require('cheerio-without-node-native');
const API_KEY = 'NHzsKq6Ci7LFe8lIDxNqtzMgQjQzeLLriWLx89LWhYEFDIYkOPNKAqpPqL9ets6D'

class Genius {
    constructor() {
        this.authKey = `Bearer ${API_KEY}`
        this.baseURL="https://api.genius.com"
    }

    constructURL(extension) {
        return `${this.baseURL}/${extension}`
    }

    constructSearchData(trackData){
        // return an acceptable search string
        const searchData = `${trackData.name} ${trackData.artist}`
        return encodeURI(searchData)
    }

    async getTrackLyrics(trackData) {
        const searchData = this.constructSearchData(trackData)
        const extension = `search?q=${searchData}`
        const searchURL = this.constructURL(extension)
        // const searchResponse = await fetch(
        //     searchURL,
        //     {
        //         method: 'GET',
        //         mode: 'cors',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': this.authKey,
        //         }
        //     }
        // )

        // let track = null
        // if (searchResponse.ok) {
        //     let json = await searchResponse.json()
        //     const hits = json.response.hits
        //     console.log(`${hits.length} hits for search`)
        //     if (hits.length > 0) {
        //         const trackPath = hits[0].result.api_path
        //         const trackURL = this.constructURL(trackPath)
        //         const trackResponse = await fetch(
        //             trackURL,
        //             {
        //                 method: 'GET',
        //                 mode: 'cors',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Authorization': this.authKey,
        //                 }
        //             }
        //     }
        // }

        // const options = {
        //     apiKey: API_KEY,
        //     title: trackData.name,
        //     artist: trackData.artist,
        //     optimizeQuery: true,
        //     mode: 'cors'
        // }

        const lyrics = await this.scrapeLyrics(searchURL)
        // const song = await getSong(options)
        return lyrics
    }

    async compileTrackLyrics(trackData) {
        let lyricCount = {}
        for (let data in trackData){
            const lyrics = await this.getTrackLyrics(trackData[data])
        }

    }

    async scrapeLyrics (url) {
        const _url = 'https://cors-anywhere.herokuapp.com/' + url
        console.log('url')
        console.log(_url)
        const data = await fetch(
            _url,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.authKey,
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        
        // const $ = cio.load(data);
        // let lyrics = $('div[class="lyrics"]').text().trim();
        // if (!lyrics) {
        //     lyrics = ''
        //     $('div[class^="Lyrics__Container"]').each((i, elem) => {
        //         if($(elem).text().length !== 0) {
        //             let snippet = $(elem).html()
        //             .replace(/<br>/g, '\n')
        //             .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
        //             lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
        //         }
        // })
        // }
        // if (!lyrics) return null;
        // return lyrics.trim();
    };
}

export default Genius
