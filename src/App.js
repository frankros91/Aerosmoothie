import './App.css';
import { useEffect, useState } from 'react'
import Wordcloud from './components/Wordcloud';
import StevenTyler from './components/StevenTyler';
import Smoothie from './components/Smoothie';
import Radar from './components/Radar';
import GenrePieChart from './components/GenrePieChart'
import { useSpotifyImplicitGrant } from './hooks';
import Spotify from './services/Spotify'
import Genius from './services/Genius'
import sortBy from 'lodash/sortBy';

function App() {
  const [userPlaylists, setUserPlaylists] = useState(null)
  const [lyricCounts, setLyricCounts] = useState(null)
  const [featureScores, setFeatureScores] = useState(null)
  const [tracks, setTracks] = useState(null)
  const [showWordCloudLoading, setShowWordCloudLoading] = useState(null)
  // const [userTrackIds, setUserTrackIds] = useState(null)
  const [userGenreCounts, setUserGenreCounts] = useState(null)
  const accessToken = useSpotifyImplicitGrant()

  const spotify = new Spotify(accessToken)
  const genius = new Genius()
  const features = {
    acousticness: 'Acousticness',
    danceability: 'Danceability',
    energy: 'Energy',
    instrumentalness: 'Instrumentalness',
    liveness: 'Liveness',
    loudness: 'Loudness',
    valence: 'Valence'
  }
  useEffect(() => {
    spotify.getUserPlaylists()
      .then(setUserPlaylists)
  }, [])

  useEffect(() => {
    spotify.getUserTrackIds()
      .then(setTracks)
  }, [])

  useEffect( () => {
    if (tracks) {
      const track_data = tracks.map(function(track){
        return {
          name: track.name,
          artist: track.artists.map( a => a.name).join(' ')
        }
      })
      return genius.compileTrackLyrics(track_data)
        .then((lyricCount) => {
          const formattedLyrics = []
          for(const lyric in lyricCount) {
            if (lyric.length > 3) formattedLyrics.push({value: lyric, count: lyricCount[lyric]})
          }
          const sortedLyrics = sortBy(formattedLyrics, lyric =>  lyric.count * -1 )

          console.log(sortedLyrics)
          setShowWordCloudLoading(false)
          setLyricCounts(sortedLyrics.slice(0, 100))
        })
    } else {
      setShowWordCloudLoading(true)
    }
  }, [tracks])
  
  useEffect( () => {
    if (tracks){
      spotify.compileTrackFeatures(tracks)
      .then(setFeatureScores)
    }
  }, [tracks])

  useEffect( () => {
    if (tracks){
      spotify.getUserGenreCounts(tracks)
      .then(setUserGenreCounts)
    }
  }, [tracks])
  
  if (!accessToken) return null
  return (
    <div className="App" style={{backgroundColor: '#e3e6e6'}}>
      <h1>Aerosmoothie</h1>
      <StevenTyler />
      <Smoothie />
      <h2>Top Genres</h2>
      {userGenreCounts && (
          <div style={{display: 'flex', justifyContent: 'center' }} >
            <GenrePieChart data={userGenreCounts} />
          </div>
        )
      }
      <br></br>
      <h2>Top Features</h2>
      {featureScores && <Radar captions={features} data={featureScores}/>}
      <br></br>
      <h2>Common Song Lyrics</h2>
      {lyricCounts && (
        <div style={{display: 'flex', justifyContent: 'center'}} >
          <div style={{maxWidth: '850px'}}>
            <Wordcloud data={lyricCounts}/>
          </div>
        </div>

      )}
      {showWordCloudLoading && <p>Loading</p>}
    </div>
  );
}

export default App;
