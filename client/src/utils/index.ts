import { io } from "socket.io-client"

//shorten big text
export function shortText( text: string, pos: number ) {
    if ( !text || text.length <= pos ) {
        return text
    }
    return text.substr( 0, pos ).concat( '...' )
}

//socket
export const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )