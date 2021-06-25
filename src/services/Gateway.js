const GATEWAY_URL = 'http://localhost:3030';

export const gatewayFetch = async (url, options) => {
    const _url = `${GATEWAY_URL}/?url=${url}`
    return await fetch(_url, options)
}