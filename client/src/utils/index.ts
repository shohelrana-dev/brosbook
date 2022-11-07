//shorten big text
export function shortText( text: string, pos: number ) {
    if ( !text || text.length <= pos ) {
        return text
    }
    return text.substr( 0, pos ).concat( '...' )
}