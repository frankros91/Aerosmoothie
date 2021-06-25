import cheerio from 'cheerio';

export const scrapeLyrics = async (geniusHtml) => {
    const $ = await cheerio.load(geniusHtml)
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
        console.log('in the fallback')
        $('div[class^="Lyrics__Container"]').each((i, elem) => {
            if($(elem).text().length !== 0) {
                let snippet = $(elem).html()
                .replace(/<br>/g, '\n')
                .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
            }
        })        
    } else console.log('got the lyrics')
    return lyrics
}