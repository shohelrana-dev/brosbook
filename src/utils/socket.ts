import { io, Socket } from "socket.io-client"

let socket: Socket

export const initSocket = (): Socket => {
    if ( !socket ) {
        // Only initialize the socket client once
        socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )
    }
    return socket
}
