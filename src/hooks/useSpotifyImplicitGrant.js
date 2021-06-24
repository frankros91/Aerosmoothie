import { useState, useEffect } from 'react';
const CLIENT_ID = 'd6fdf5ee87584aec9befb00285a73203';
const PUBLIC_URL = 'http://localhost:3000'

const getAccessToken = () => {
    const hash = window.location.hash.slice(1)
    const hashMap = hash.split('&').reduce((accumulator, keyValueString) => {
        const [key, value] = keyValueString.split('=')
        accumulator[key] = value
        return accumulator
    }, {})
    return hashMap['access_token']
}

export const useSpotifyImplicitGrant = () => {
    const [accessToken] = useState(() => {
        const token = getAccessToken()
        if (token) return token
    })
    useEffect(() => {
        if (!accessToken) {
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${PUBLIC_URL}&response_type=token&state=123`
        }
    }, [accessToken])
    return accessToken
}
