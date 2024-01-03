import plaiceholder from 'plaiceholder'
export default async function getBlurImageData(url: string) {
    return await plaiceholder.getPlaiceholder(url, {
        width: 10,
        height: 10,
        quality: 10,
    })
}
