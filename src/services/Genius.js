import { gatewayFetch } from './Gateway';
import { scrapeLyrics } from './Scraper';

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

    async getFirstResult(data) {
        const searchData = this.constructSearchData(data)
        const extension = `search?q=${searchData}`
        const searchURL = this.constructURL(extension)
        const response = await gatewayFetch(searchURL, {
            method: 'GET'
        })
        const searchResult = await response.json()
        return searchResult.hits[0]
    }

    async compileTrackLyrics(trackData) {
        trackData = [trackData[0]]
        for (let data in trackData) {
            const firstResult = await this.getFirstResult(trackData[data])
            const songUrl = firstResult.result.url

            const res = await gatewayFetch(songUrl, { method: 'GET' })
            const html = await res.text()
            const lyrics = await scrapeLyrics(html)

            const lyricArray = lyrics.replace(/\[.+\]/, '').trim().split(/\s/);
            const lowerCasedLyricArray = lyricArray.map(lyric => lyric.toLowerCase().replace(/\W/, ''))
            return lowerCasedLyricArray.reduce((accumulator, lyric) => {
                if(!accumulator[lyric]) accumulator[lyric] = 1;
                else accumulator[lyric] = accumulator[lyric] + 1;
                return accumulator;
            }, {})
        }
    }

    // async scrapeLyrics (url) {
    //     const data = await gatewayFetch(
    //         url,
    //         {
    //             method: 'GET'
    //         }
    //     );
    //     console.log('got the data')
    //     console.log(data)
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
    // };
}

export default Genius
