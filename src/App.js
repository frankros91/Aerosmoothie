import './App.css';
import { useEffect, useState } from 'react'
import Wordcloud from './components/Wordcloud';
import Radar from './components/Radar';
import { useSpotifyImplicitGrant } from './hooks';
import Spotify from './services/Spotify'
import Genius from './services/Genius'

function App() {
  const [lyricCounts, setLyricCounts] = useState(null)
  const [featureScores, setFeatureScores] = useState(null)
  const accessToken = useSpotifyImplicitGrant()
  const spotify = new Spotify(accessToken)
  const genius = new Genius()
  const features = {
    acousticness: 'acousticness',
    danceability: 'danceability',
    energy: 'energy',
    instrumentalness: 'instrumentalness',
    liveliness: 'liveliness',
    loudness: 'loudness',
    speechiness: 'speechiness'
  }
  useEffect( () => {
    spotify.getPlaylistTracks('37i9dQZF1DX0XUsuxWHRQd')
      .then((tracks) => {
        const track_data = tracks.map(function(track){
          return {
            name: track.track.name,
            artist: track.track.artists.map( a => a.name).join(' ')
          }
        })
        spotify.compileTrackFeatures(tracks)
        .then((trackFeatures) => {
          setFeatureScores(trackFeatures)
          debugger
        })
        // return genius.compileTrackLyrics(track_data)
        // feed name/artist to genius service to get lyrics
      })
      .then((lyricCount) => {
        console.log('back in the view with the count of lyrics')
        console.log(lyricCount)
        const formattedLyrics = []
        for(const lyric in lyricCount) {
          formattedLyrics.push({value: lyric, count: lyricCount[lyric]})
        }
        console.log(formattedLyrics)
        setLyricCounts(formattedLyrics)
      })
  }, [])
  
  if (!accessToken) return null
  return (
    <div className="App">
      <h1>Aerosmoothie</h1>
      <img
        alt="Steven Tyler"
        style={{ maxHeight: '250px'}}
        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBQVFBgVFRUZGBgaGyEdHBsbGR0bHRohIR8dHR0hHB8dIS0kIR0qJB0iJjclKi4xNDQ0ISM6PzoyPi0zNDEBCwsLEA8QHRISHTMqIyM1MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//AABEIAQUAwQMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAGAgMEBQcAAQj/xABBEAACAQIEAwUGAwYFBAIDAAABAhEAAwQSITEFQVEGImFxgRMykaGx8ELB0RQjUoKS4QczYnLxFRZT0qLTJFSy/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAIxEAAgICAwACAgMAAAAAAAAAAAECESExAxJBUWEEEyIyQv/aAAwDAQACEQMRAD8APQKUBXRSopxDyK9ivQK9NYx5FJLCvGNUHGuLwCiHnBbkP70G6ClYvjXH0tK2XvFd42Hmay7inabF3XJ9qyqToFOUAeJGpNWXGr3tDlJKoPwjn4nlVZhmtTlXfxk/Xf0qTmVUKILcYvyJuO0dSTUix2lugZcxPmKthbQiWtqRzMR8zz86RjOD2mGbJHiDBH5fLWh2C0U2P4s15e8TI1JJJJ1H6VGtcRZCDmPkCB9Z+lScTwpl1tnNod9DHhyNDtxCGIO9Osit0X78XzznLNM7kfkN/Sr7hHGLb20VmFu6ggXBKt4SR709DQKhHOnkEc9KwLNXwnHbllg1wZ053EjUciRt8h9KL+HcVt3QChE/A+oOtYZhuJXEkKYBEaUQ8IxavHsnKPOiyYPlrIPl8K1hcbNlRwfPpTkUF8J7QXBAud/keTj05+lFmFxaXB3Tr0O9OmTaokRXEV6a9iiATlrwilxXRWMNxXkU5FeEVjDcV7SorqBhivQK4ClAUTHgrx/Hal1GxLQD5VjFPxriGRZJ8h+Z6nlQPjMUzmXMDkN4++tWHaHF57h6DYDwqjxIIHeIHXw8CahOVujohGkJCyYG3z9Kj3LWVoaHHMEQR0KxuPDpNJYZfc7ynkDMeX2Kfs3w4yusgaTsy+c7/fjQWDNNjqYoKIMkRud46N1Hj69Jk4C7kLWyZTUjwG/9/jyivbGBRhG4+/DSrFOGjlr/AMRQlNDx4mykvIQxX1U9Dvz+9qHeP4cNFxBBkBh0P6Ubnh+09N/Kq3EcIMnTQkaeVaPIjPhYDLhGJ2ilPYdNxpV9isCyyY2MbfSoP7Qw94mP9oj4QKdSsSXG0QEugHXT7+dPs0agwafvYZHWVieYGx8R4+FQYImKOxcov+F9oWtkF/3i8wfeA6g7zrvNaD2f4il3/KuaCDDbifnyrHc861ZcG4q9m4rA6Dp47iOlbRnk37BYqSVcZXHLkR1BqyFCvBOKLiLasIzCJ166fCiTDOToeVURJofivIr2K6KIBMV0UqK8isYTFeUuurGIwFegVwFe1jCSao+0GNFtGJ2G48eQ8Jq7e5AoA/xEx4SyLYPeZwfVZOvxB9aD0NFWyvuoe87e9oPWJPpND/GWn/aAdOp2167zVth8UblsMOeU/ED5ypqDirYeyTseZ6RofmK5ls6XoqeFWG3kweUn5ffWijBcOJ/QgflVZwQZu8fIfn8+dGGGXSp8nJk6eLiVWyJYwMbfMVdYPDHnHrSLaa1Y4dNNqi5Nl+qiQ2w3X5VGxFsRtV21sdKrMZa1061nYVTKHE4cHaN6ouIYAGdNR8KJcUhqsxid2en500ZsWUE0AtxcjkTH3pPpIrzE2srzGhEx4c6cxvvt50rEOLlsRoyD4+PwHyNdi8PNkqbK85Z+9a8R8pB38OtNA660vJ46Uwgd9geIQ7oCYG080bQfzKfka1rBP8zr9KwDs9fa3fQqJPMdQSD+VbjwPGJcRGUyCI8iNSDzB0+RoxYJovYr2K9Fe05MTFeRS4ryKxhMV1KiurGIwrjXgak3nAUk1jDOMvBBmJAA1+VYl2vx/tb7nWFICz/U+nn9KMuN9oHdilsFn2VRqFnQSf4jO3p1oCTCxcue2nOpkg+cknrImpt2ViqHez3FVS57O4YVpA9eXhrqPUc6scTcCi4g1B7w6Tz+Y+dB7nU+ZirHCYoiEY6RA8J5VOS9RWD8YScEXuKRtRbhTIod7OWf3S0UYa0QNq5J7PR4/wCqJSLtVhbU1FtIal6x0pUFnrbc6h3EkzVktsxqd/AVHuWTNZ2ApsXaqqx1rukDpRHetVV45RFBBszHi9rLc8xNVzuVgjrr9+tE/HsLJLdDQriRyru45Wjz+aFSsYxCwZGx1FONqsjfnSCO5HQ/X/ivLTxVCA/h77KVYHUHQ1rXYfiK3MpkBiArDxUZkf5EVlOHSZ8/hpV32fx1yy6OqsYJIjmsHMI2I19KF5Gq0fQNl5Gu43p0VQ8F4ol22rq0gj3hMDqGG48uXWrtLnXf5elURBoXFdXgYUqiYTXUqK6sYq1NVHabGG3YcgwcpHyq1Jqi7YL/APjM28FfgWA0+NK9DLZT9l8Ci2hcaMxG/SRv5nr4RyoO7Wur3RdQxnUDQQGA5/GAOtFWA/yHRtrZYMNhodvLnPQ0DXrr4m8J00gDkqgfp9TSN4KxVsifsRkGNN/M/oKjYpcp15b0ScUxNuygRdbjCB4DlHTz60H8Qu5nhTI69TzpY2wypGg9n+I27dlM0kkTpynXWr//ALhsKNW16UE4HAMtssQTlGgkawPrUL2Fy4mcZQJjKCM3w3jxqLgpM6lKSSNPwHHbVwSrbdfGrR8SSEMaeccorKuHcJvMc2dkIPdX3jufAAxpJ0rR+Be09nluOCyyDAAB+M1KceumWhLssieI9oxbEDcDUGqT/vnkUAPnpUjFcLt3rzG4MygQq6xPMxIk6/Ko54BhpM2SggxkUSTyJIM+gox6vZpJ7Rw7TXG2yEev60jFcZVhlZSpPOh1uA3Eac+UcsoYncnmB16jQCrnAYW5ctRdMkbMY/WmlGKyJByfhHxaZgefl+VBXE8NlM1oLYXL1jbUgk/A0LcfQagb70eKWaQvLD+NsHY7nmwHy/vXXEAIA5AT5/ZpTvoige6CxPUsdPl9abR9STsP711HEP2icwOvKimxZDWbQRu+LseIJ6dRt9mhxFBty2h5ff3vUzh+IZGW4hBM6g6g8pjypRkH3Cbly0+e2Ml1Xy3VHu3AfdcCY3ies8iKOeH4sXQrroDIK/wtE6eB3+GmtZjhOKG4weRMZHI3EnusR4GNR40acExf7xRoPajPA/iTMLgnrqKpF/BGa+QsdIEzT1l8wpkITXlo5Wy1TaJaZLrqTNdSjlS5FD/a3HotmCRq6aczDqTA56CvTinvtIJVOQGhbWJJ5DoN/oB3teEtoIEEGS7atppAJJ67eFI2Uisg1xPjJS2ba+9c1bX3eR/mIFQcC/s0a4d958B/eflVRnNy4W5SY+ZH61N4yxVEtnQEa+mg+esVOSvBROkVl3EM7Ncbcn4UzbE3EH+ofUVLw9iRHUGPMVEsmGnoR8jNMA1rhuBDKIA25Rr5mpq8HQfgUffSmeCXQUUjmBV1M6V57bTPVSwRcoUaH5aCl4E5bTHmdfiaRjVIA8akIkW460PDJDVmzm19Z8YFTLSCO8Neo/SouHvZGAPumrK0UPM0LaNVjRwqnx84/SkXMOAOlSLtrLzqJfv6EGtbYVEpOJIBtA9Kzvj2K/esvRQPWKPsfc3rL+NsfbOepro4Fk5vyXUSOv4ia4W9JGo+96XhgGhTpJAB315A1JsWntsREjmvXpXUziSJdgC7aS2o/eAkQN2H/O1V7ZrbEEacwalWrgBD2yUIO07H/mlcXx4vKGZQH0kj8X96CCxjD4tlbOp1HX8Q6GtN7O8QDGxdOytr/MDbafiH/lY1lDoV350a9iuIW49hcMK8iZiRG3gdaKdMEso23OBzqM41zdKq+B4zOmRj30MEdeh8iIPqOtXNu2TVk60c7jexj9obpXVM9gOldR7AoD+CXAbYA3gf2oG7b3S7uP8AxkAT4jfzlvlRX2XufucxO2v38KFu1lkhXfUG5+8X/aI39AdPGovReOwcw+FK5SQMpLa+TFT9ai8debqAbBPzI+gFO4TFMUUHYEgfzEk+UH86g4+7mYHfQfOl9H8FWHysF57j0/WmMeoW64XYmR5MJ/Om7ilXHXSTS8Y0sD1UfLSigMP+ymKJtpP8P0oyw7zWW9jsa3eQnRSI8AZn5/WtFw+KVRJIAHU1x8sakejwclxPOK3LgK5FDeBIG3KTpJpX/X7eQggBoghtCp8ehqqxvEybkL7vPx8PvxpjAXRccZrYcloJjUAbfZ8a0Y4yM5q8Fjg8Vibh72FK2olXLqCehyzIHzq84bclADodY8pod/b3MGdiQBBG2mx9Z8q8tcRKNmmAxIjQmR9z8a0oXoHethXcvcuYqtxJNVo43bI72hHjz6A1J9pnQMDIOx/Wp9WtjxmmVeO2NZ/2hs5bnmK0G+NB46UF9qFkj1q/E8nP+QriV/CLQLa8oYeMGSPDTX0FO4vED2jEayPmNj99Ki4e8VEg7ffw8KbEsygamYHxro9s418EcXTmnqdanXbWZMy6wdfCoy2N3I7o59eg86k4G5HdP4tPM1mZfAy2uh6aeeg+/SifhHCVvJkQ5LoEhT+MdR68x1FDSrJIJiCTNE2CxThBnQErrbuIYZD5bQRodqzNTLTg3FbuEuI9wPkPdcNyy6EqfCdv0rZcO4ZQwMgiRQh2dFvF4V7dwh1cENyZSZmfESNdOVSOwGKf2L4e4SWw9x7YJ3KqRln0I+xTxwSlkLK6vYrqcSjG+B4q4qezK50PvZR3o5yNvgfSrLtCLd17IPuFTn3WMik5SNxqRp4VE7IFs2gmfsffnV52g4a+ZLqjMyAuEGgOUqSNdyRInxGlTWil5MkxNs27jW4gqdjvvP0+lM5Rnz8hMf38Ktu1rocS1xDIZQw9RI+tDNy8SfCloe/kk4opEqZJ9KZxD6iOleWELE+AJ+G9IbceNMkBuyx4Le9ndQ8m0P350W8UxTSAASI+JM1ScW4eBbW6ngG8GiQfWrfs5et34W4e+g93+IVKdbL8T/yOcPxABg5mPXKQNuUDWrfDXnTVUgnX3d/UinMTw7Y29COU/SuTG3LY79smdPdH1mKnaZ3Q6xWRTXrjfgaB4qPyioOLe6RELJOzQfOdPAVObihaRkdZ390DTrlp9cKYBOx2VdS3qazaQZOLWCiHDLoErlMiSFEzyg5tT8atuFMUsAMCD7SBPPr9DV5Yti2BmA8h+ZqlxGK9td7vuICBykn3j6DT1qbl2VElFJ2hrGGAg6kH8zQV2nuglQN5NX3F+KKHLTCrIHidqCb183LhY7DWq8UfSXPPFCmfuEdfs0nA3cjZjMwQsdSCAfnSXUxPr+lcluED9W09BNX8ORPNkjFYqQLY91N/FtifTb0pnDSD5VHVTMVMtiCGI7p0nxFDRk7diAhZ2j75VfYDEvbWV590jz3+VQeCY1LVxva2w6Po3Vd9V+Ndex6o7BO/HdTow5FuhiBSu7CmqyGPZS69o3Llpg7Wsjsg3dHzZkbqwKkjoSORaTHs/jkbHYgWzmS5as31PIyMpI/loC7DB7dwXZkuCTp7wBgjxEQY8PCr3huKTDcXOUzadRbOsi3n/eD0DknwD9BVETZqnx+NdSo8K6nEM57I2FCKfvbSiPFMO8eSrHx7xHyFCPY2+zJlHxok4qwSwwYxqBJ3aWAJPjrQWg+mFdoGPtXbYMzEeWYjT4VVBavONWCzG4mqZjlI2gsSPzqDhsMZKkb7eu1IngrJZOuqqKhWZZNT1k6xTdxe8JGxp65bysgPKPhM027ZrhHIMflRsDQQIxC3LTNmVgCDHlH1+tDwuslwOCRB1gwYq5uSFE7gKh8tD8YqkvUqGZqvAsct1FMz+dW9xEYQ2w132rK+BcWe13GOgOn51fNxZnA78Aa6mQem2/2ahPjaeDq4+ZOOQ/N+3AAyz9711opEk6jryoCucX1kGCPQch16CaaftCYAzRyOvzpP1tlP2xCninEBBC6z1OmtD+O42lm0ygqXbSF/D1+VDt/ixnfc9dNKr/2S5cM9ddefU1RcaWyb5W9DN+895/DpyFSrxW2MiAbd4nU67+APLwmkYXuTl1Y6L0XkWPj09aiXm1j41X6Od4VseLyg8THpSXkFY2A+Gp/IT607h7OfIF1ZjEDxI+dSsNbGZ5ByAnMNyBJA9RFFuhasj4nDxJXmAQOoOlIclRlE5d/WKlX7ZVBJBTMQjD0JHkdDTAXXqTPkJrIzQjOCA1LvWV0ccyBHQ0n9nc53CkKpMzynkadwaECCdH2HQ8jWZlkIuG49rdtCkFp7qnbaCT0WNSaI8bgxaslx3mS21wuR/mMzoGnwgsB0BA5UC4fFG3K/iC5Z6dRRDb7QZ7RskQShSYkd4qfgIoeAazg0z/uT/SfnXVB9vY/jT+oV5TZFr6KvsNbASTTXbHii3nGDttpq9+4NraJDMAf4zoPCR1qJ2c4fdxFvKX9naHvFCc79QCYCjlOp6RUm1w9CSltAq3ByGiWkkj1e4ZnmFpvBfQUxOE9nhkzd3MC0aQpLBlUf7VYfOq3AX1DkuNQp16Rqf0ov7a2AqBCIMgpG0A6/DagDEXO95TPxMVNqmVi7RFu3CW1607wayHu5j7i6t1Max5moriW8atEUW0CDlqx6n+1FukBK2OY5+/PMyT0nUn4DSqq+vdnx+tSHuZnEbQabvpsPH6QaywF5PcBgmv3Ft2x3jz6Aakn751eYbhjKSrgiNPI0Y/4Q8DVy+IZQQO4pI96PeI9dPSiPtT2cbM1y0s6agDamEumY1iMM0MOYNVryNKNb2DOcjLE6RXuH4bbWS6Ak9RUnOjqjDsB2C4e9xgFB8T0opTC5FAOrKBPiKtLAQaKoA8qcvWl06RB8jv8ACpS5LZePEooFsNw+Gcx4CdtTr8qqsThT7Qjxj5frV9xHEMhy+NVbatPMCarBnPyLFCsGFS6hGmUA+IOWT8xUXA32V1YdCCDsQdwfSlKuZ3bkiE+p7q/Np9KdwpTOCwkAvC8zqIFOSPLVxcxVhmXWAT8D5j6ioNxyrmDsad9pmfMNpJ02ABJ+FIW2DmPMnSggMnYm+XRANSZkTptoSPKKj4fTQxPJmJhIMzA36etN2WgmNdI9NBU23bUDM7hdCfcL76AActBM8oo/RvsjG7LEiZY8tjy86tWwoTIyuzMdSIgjTfy1G9U9jMWLeOkaajwq+w2OuXCGfvlFRFAEaZthkE8vWKasCW+wn9kf+JP6zXVbezvf+Fv6a6j1BYQ9kuO2b9sWQQjkaqTqw5hTzn4xNEeAVIe60Kh7qkwAEQZR6TmPrWDYE/vAZIgzv01ov4T2rQ93FI1zIALSyAgPIMNB/Ma1gUcWW/bji6umZRCAkBzpnOh7s/hHUb6Vl73iST9ijjtngbrWLd+6wJd8oUbKoRm7vLLpvEnfTQUFJZME8pj5T+VD3I14pFlwTC5rgDCSIMfOlcXtlFUdQv0qf2fX9/Zbk4ynwIGX9Ke7X4Mrk8O6fMAf+1I9jLBRINAegp25hy7IqCWcqAOpbQD40lF2Ech9/Cibsco/b7IJWRJXNtmgx9TW9G8Nq7McGTC4e3aUe4ok9T+I+pk1eKIBoaucSxlsjNaR0kSUzSBz0mflV5ZxqOpKmZ2nr0/tT2RooeP8Ft3CzqoDqJkdI2oExmHGhjzrV74VFM6k/PSIrKsKpDX7bsDkvMoBgEBpdYHMRInyrn5VWTu/Glf8SGMOvXY17cyqunqaeu4bU71BxawO8dBqfEDWorJ2PAM8VYvc8T18PsUxethFDzMAqfUivL9/96WO55HlOoEdefwqRxQ2xbGQzA7x11OhO/iYHlXTHFHBN22VWBE3BJCrKqxmIE6n5TS2fK7skwNEJGveOhjkcoJ9K8v2AlpDBJYZ26ATC+pgfE1KRSmVW9/LnadgzgZZ/wBqQY6sRTsivgiLbyKBHeb5LP5n6eNeugCbd6PieZq5wnDnIe8yyPYM6LGwMKpn/aWj9ap/2uCr5ZhlgdSCGj4UEZ0RMMe9PIfetTVBdgIYywnLuf8Ab4kmNo1qVaw4N3MBKs867EtO46HpXuHTvhSQf5sg155jMAGNd9NNYo36Dyj2xw7IsOrK+mh31Ma/wzr8Kew2FIRiM0LEaEEa66DeJ/trSMPazGGYuo0BthmWAdIza5denOpxsi1keG9hcnUgiQDlPKAVJ3FU8EvJC9ni/wCC58Grq0b/AKiP/wBhP/h+ldWtfItmNWCQdN6Qw8R5V1toI86Q7anpNashvBcYfiFy5aFh3LIhzIDrlJBBAPTXblTLWstuZjvH5L/zTHD7mVpqVjx3QOR73x0FK9jx0TcA4DIJjWVPSrvtFf8Aa22YbEBtDsyzmA9GP9IoS9oY31A/SKs8Liy1sqdirH5ffxpKGsjYZQTPIflt86RafNemT3TMqYOnQ8tajFyNugPxqX2ethrmUzqNYH5c6yWbNJ4o2b/DvtScVb9ne0vLs23tQsd4f6hOoH/F/jrrWrmbKGRyW00IiMwPXeR0NB1zg9ucCttygtk5bqKJzxOTmDmjXedRzrQcLb9oZddAmXUaEkyxHhoKo0RTG/aF1BPLbxOkH1GvmDWe8ZwoXGXJOUXFDiAZzKI5EfwxrPlWkYnDQrRoFXuj5/lQH24xL2riFT3WMnoQYMH4mubnWDs/FzKvkjqohgSpKkgkGR5g9KH8Vb9qWO1tPeP8RGsa8huf+an4++LZCW2EXNp0A9eY5z5imcRaaDYt3BC22e4QAQkaxOveLHfnBqMFk6+SSrPgEYXK95rjahW0HXz89vKnuMW0AVUIPNiNidJC+A2nmfKmcNZTKQTGUsPEkE6np3R86k27JJkD3BA8TOg+P0rp9OLYpsNnfDW3khodwdgiDMVH8o+PnUK0r3LhuHQ3XeDyk6Trykn4VMxNx2uFdQShtieQMKY8wKveF8GL2rZUhRhzfLzyIDPbnxnT1otipBBxDCpbwtx1AUtNtY10VHYAdRJFZPetkqDyBPx61rva62bNnCFUzK7ubjETOZZA9J8tNKy6zDWyp56jwbSfQxNHQqyWWPthMPh3/ExbNHSP+KYsM499WVLkEnIDIkwUzCNxodpAJ2qw4VhRfOW6YRLbAGfdJAKx173LoTV23AnuIg9pnDAKoM6d2NDqsc9Y0plHAG80I7PC2bbWn953f2kOqXLYEQxjbWFgRLkekHFYO9et5kUsc401/E4tgLvMtudok9as7HAzhGQ2rhe47BSuTuqTJzEmR3SR6aaTNFmCw1qzZt2bbZmQZ7hPvEgHNI5GTOXlA9aRIzdZAn/su9/5f/mf1rqNv2W54/1LXUaE7GBCuUVxryaBQkWxrA3ogv2os23yySrH0/sKG7W486O2tH2KMNltE/EAfTWkkNFgXYQsTzJn8h9TVzhMERZZv9JA9SAPoarOHKdAN2OUderH0HzIop4/cSxbS0vvBQT4mP1JNI2OkD92yCzoNSoAjyAH1r3hV42risDuGB9QfoYPpUfCMc+bcn8xNSEH73KNDnkeFZYYzyaDheMd22TJT2isQB/lupHeno0nMNto1rYLA5jaBH1rGME7h2FlsgZBmUgMGOzgj+Cduda/wW9nsW20koJjqND86qyFEt0mfERQH244c1y1byiWVsnjrpE+vzo/NU3H1i2zASRDAbaggj6VHkVxZbhn1kmZfhcA7X1tuhJt2wBI91nYxPU6RPhNSO0CrYe+i6szZB45UXfpqbj+i9aIeLLctNZxKKoV4Da5u83eTMYGxkT40M9prd9LpN4d+4e5liBmWD5aD50kI9Y/ZXk5HKX0AS4UqxboSNefun15GrfhtzJZN1tc5CqI6sV36wHP2ah3rZyu2oXQqfkfnFKwzMpFl5UIxJnYTB+UnXxNM8gFYnEG5cW4gg55UHqHJAPmViPGirsyXa9eykZLpCjb3mzsGidgFII/1CqTD4m0Gf2mtt3uLK6FASWtOvwJ9DVr2Sx6IpQ3FDC4hQmBm/eJIUbk5SRHTyNCsAsLf8S8T7LD4VInM4UH+GFBH0rJOE4VXUyYzMQo6zoI8AR9K1b/ABUvD9hsMRLe0GU9IBk/AfOhU8J1QswRLduRACs4MiQ2oBBXXnAqlWTTpFDwnEm0LltgCGGh/hg+96Grzh/EltFPaJmUyxBgqQZ73TNr4bxpyq3wF4qrZDBciSQBzUzOwgAk8gdancT4d7NSjkJdGgSQS4kz4SIEnlI60YAkW3FuI372S3YtOqPlC3GBBy6gEE6BYB68450/a4V7MqgYyisXlmOdtSTBmc5O5OhPPlV8Bx98W/ZiHQEkAkAqwI1LbKANYbSOlTLvHr1wtasrlZ2nO2pQKoIgEETpmhiJCiRrVk6ItN4Jf7MOif0f2rqgfs93/X/V/euo90H9TMmNJFKNIXekCPWjBo7x+IAwSAbm2B8ZH5GgS2JIA5mKJeOXCgt25nKoB9JB+tJIaI52ZwWa5bcjYsR6Zv0+VRePXjcxDg7TA9BHwq+7KYgEWxuAzAk9DH61RdpbXssTcXxkeR1qfpRFfhTDeop7Dsf2gECTmiOv3rUfDW2kdTy8f+KncFss98RpB3mPvnTLZnoKjg9GZiJ10GjGdZEdJ8Nq1HsBduHCKtwGVJgkEZlJkHX118KA8NhS+t86KB35UCNu9EbbSetaB2e45YvMLSOGdU1hSB3YmJEc+VUZGVqglqLjcOLiMp/ECPiNKl14RQCDPBMMl/hyWW1yobZ55WQlfiCtBHa7ik20FzS5bUhuuZM2vkyw1aHwW3kuYm2BAF3ONI99QxjXUTOun5nOv8WcFDtcWAHRVP8AuIufMgUlYHTyBWBxHtLSWmB0IJI1lWdSfgJqVxZ09vefUrknXukkgQP6iB8+Ve4C0FtsSIyrDagSAFJA8dDp4ivMBgP2jGILhJV2zMJ8yFncmB8xSLZR6KliPZDeRAPzE+cfnV5wREuXMJlADG4odRrmVD7TOPDuNPnUnt1wlMPilRABntqxA2DZsp9NIpXAEC2Dc926FKW5me+pzMvLVAduYE70XoCemD2Mx1y8xD3HCm47BXZsqF3J0VjCxPQUWrwEW7L3rl32ns50AjQEjQzsSB6NykUPYnhNxbAvMkWy2VXJGZzrGg1jQ71eYfiinDMhcOAoCplIKxAVSTvmY9Nj6U+BHeCz4TxIXbSMigut7vJsYZWIImYVgInrUbtLZtm5btu5RLZMMVE210BUEbqsmCeg3EGonAsLqqrdUZAWKlu9IUwAI1zDYAyCPGpvaPht25bDG5K3HQlSu23eAHvDLAI09dSDWANqyy43wnCNgwcE6P7OGYqwYvyJuEbNqzA6bEbUOcBRQWcHNcNtii6gMFOgWTG6yef5llzC27ds27alEDBSQY9o0qAvd6wJJ2BHUUN4Th65mYEgSSpGsgGV13gSN4p/oWKxZVZ7/wD5rv8AQ/8A617RN/16/wBE+Irq1DY+TGab505TbVhCz4LbzXU0nvD61P4s2a6/grb9RLflUPgd0I4fmMxHmEYilYvEB0Nz8RWD5mBI9JpHsZaLbsxc0e2Jndf7U720UvdW51QBv9w0n1EUPcJxfsnVxyYH4H9Jop42gdiJ3nLrpI1Hx0FI1THjkGlvFZPPUCiLsSlt7zo2pKd0/wCoTt5z8qFmY69Zoj4bhLYtqAJZf3jgNlLqILATzjbypkvQthpjHtXC9oMuYblZYKQdxG45GKV2NfJjLZ2kEaEEEmB0kDUt471TLxS2zpctBUUEEJlCyq90y0zJEmDPKiy5gSzJdso4uoxYFUYrsCVcxpMtryk0/hNqzTBXnOmsLfDorjZlBHqJpznQFI6WYuO4/EqD+kv+tAf+KuGJw1td2a7mJ8AjdeQ0+B61o1AH+J+iWyBLd/4BRI8BrSvQ0dmY8RuveyZdgBrlCknx1nfT0FHP+HfAZve1cf5Y7pjQtsfhQ3wrBFiLZBGhdtJgIjPHkSAPMitd4Fw63at2yihWCBSV0nqSNiZ1111NLFDzl4ZJ/itiQccVk9xUU/8A9mP6qabheJuIhMBIHsyBqrKJVRB/EoXveA2jVrtVa9rxO5nnKzkiBqQH9mPiEBHnWm37CmyCO6MohiCJ6ADz1PSKZLYJOkjNsS2IGCZLhU2kcFSdGUk/NYJ31modjBfv1Ve8iL7RywJUDcCesEH4bVOxuKUYd1uZs162GQB4SQSneG+YQDB0iKe7J8Ia9dXM4KupaBzPclSDyE7+A8KKWQP+tnnB8Er31n3AczMRBAzAqe+AuaCNQIAIo6x922ltTcOW3bbNL6ZshzALEZtVAgeWlMYTCWrJdWzTcYhSUymMokQNAu8nqd9Ko8Tw5cQVuXHcZCUAXJlXISIM6KSqiVG5013p6EtEDtNbZltXbMqSJDK2QsjnNbB1BldNOUml2sDcTDvMkW9SyaATsS/MEnUeEVa43D+0i3cJCI2VPZggNACjUyQQp+vhVRxuxctq7WrkSJIUsq6AQSolTsBB50yN4Dntx/Gn9Vyuqk/arn8K/wBNv9K6jg2SmpD0ukPSGHcG8MPvcEfQ119tFA5T9aatDnSmagYVYEkAdaI75a4NG1ySvjl7s+fdobRsu1WOFxkAAGCj5h4q2jD4x8TSyVjRlQ7ate1cCVVp1zGPX1og4Y4sO63EOY2yqlSCAxiGgTOlDptq1zMrBecnbTlpRDw+0LqMCdSvccj3SpE6/I+m9GKDIsuEYVxmRGVxcUhhl0tsSNVMQJ2y9daLuPcYuWQyWyAzaN3fekEAnSByjbrUXs9w1rSB7lwZEYZbawderGJk8hSsVw5bwZrjFWL7RyE/in8uQpqE2GXYTGC7grZ/glD/ACmB8oohmgrsGyW2vWFBVQFuAEz70qSD/KPWaNopGY9NCXbawWNhokBmXw7yzt/L8vGiwnSqnj2H9oiqImQR4EEEemkHzoPQVsDOEcPW5csOBEqysJ1HfXcc9Awn+9HzYcBZWUIE93rzkbGqThGAi8XGiwsCNO6D/wDZH8tWvHLzJh7jIJbLCjqSQo286EUGTsx/jtprmLtNJR7gyMdypVlMwJ7x7zQP4vOl+xxDsv7RfZrKFWbK7QPAp4+7/NvFIF21aKXsQpN43g9zuSAvfRQxAJB72fxGWi79nt4pZsEhLk5mZWywe8wVWUZiW56DYzpAolkHZ0AXHUt3YhhozNI91QZ7vKCWA26Va9krq2Lpt50ICkqzSmXNAYaka6fKI10sLvDRbZ7RAYW/xZQGEkkHTX8J8fOqbDC37S4pOhJLMSCdcoJ00JBmY6UaM9BFxzjFy7buWVy3ZIBa2Jyg6HNl8zqN5PSrDAcYQOuFs2GZQBDtlCgLpnOWe6IHLWRrrNSeD8Ot2rbsVglCzn8RgSBIGkQNBpM1S9jHTM7rmVCpRC2pUhQ75ZmQYnz+FbYqpF9xTG4e2lu21xEObPLGZ1kmIJadJ2/TPe1vHrFxCEYudswQr13nvEeEx4UTvxDDfsz3/ZC7dVSSHOZkUABoLyM4YwTvlE9KzXtHxM3e+T3rgkqqrkUbgDSZ8Z/SihnWin/avAV1V+XxNe1gUeUi5XV1Awpdq411dWMcTT2ATNdVZidJrq6sYcvTbuEAzBI150TcLvEYW71QhlPSdWHrA1rq6sNENmlbGfM3vgZQYBkTrvPvRpG3jRLxRJt2tYgHQekfCa8rqzAtoHuwnEWucQYxAZCpEztqDPmPnWsiurqVgObY1XY5u9b8/wAwPoTXV1KzE21bAGlROLnuAdWUfU/lXV1FAejIMHaW/jLIIhL7MzLMiU74HLTZYEaDxq34p2guWvaC2qrlkDeOYkARG52jf1rq6qDLTKTh/agswQ2hnO7h2E/y9PCaIMXw1WsWrndHtALjdwEwT3kDbgEmZGteV1D0z0FuCyurWisq7m22YkyI16bgxQNasexvYjBZiyW2JVvdYDuNBI3Pe38+sDq6ghVsE/bXGu5kdrbt3pQxGhmB1PWee1RsZeC5Gyz3HABMx3lEg+fe+W1dXU4GUH7EOv38a8rq6sY//9k=" />
      <img
        alt="Smoothie"
        style={{ maxHeight: '250px'}}
        src="https://www.wellplated.com/wp-content/uploads/2020/01/Greek-yogurt-smoothie-peanut-butter.jpg" />
      {lyricCounts && <Wordcloud data={lyricCounts}/>}
      <Radar/>
    </div>
  );
}

export default App;
