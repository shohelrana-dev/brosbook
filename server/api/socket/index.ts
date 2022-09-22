import { Server }  from "socket.io"
import ChatService from "@modules/chat/chat.service"
import User        from "@entities/User"
import http        from "http"


export default function socketHandler( server: http.Server ) {
    //initialize io
    const io = new Server( server, {
        cors: {
            credentials: true,
            origin: process.env.CLIENT_URL,
            optionsSuccessStatus: 200
        }
    } )

    //chat service for database action
    const chatService = new ChatService()
    type SocketUser = { socketId: string, userId: number }

    //connected users
    let users: SocketUser[] = []

    function addUser( socketId: string, userId: number ) {
        !users.some( user => user.userId === userId ) && users.push( { socketId, userId } )
    }

    function removeUser( socketId: string ) {
        users = users.filter( user => user.socketId !== socketId )
    }

    function getUser( value: string | number ) {
        return users.find( user => ( user.socketId === value ) || ( user.userId == value ) ) || <SocketUser>{}
    }

    //Listen connection event
    io.on( 'connection', ( socket ) => {

        //send_message event listener
        socket.on( 'send_message', async ( message ) => {
            try {
                const newMessage                     = await chatService.saveMessage( message )
                const { socketId: receiverSocketId } = getUser( message.participantId )
                const { socketId: senderSocketId }   = getUser( message.senderId )

                //receive_message event fire
                io.to( receiverSocketId ).emit( 'receive_message', newMessage )
                io.to( senderSocketId ).emit( 'receive_message', newMessage )
            } catch ( err ) {
                //socket_error event fire
                io.emit( 'socket_error', err.message )
            }
        } )

        //send_reaction event listener
        socket.on( 'send_reaction', async ( reaction ) => {
            try {
                const newReaction                    = await chatService.saveReaction( reaction )
                const { socketId: receiverSocketId } = getUser( reaction.participantId )
                const { socketId: senderSocketId }   = getUser( reaction.senderId )

                //receive_reaction event fire
                io.to( receiverSocketId ).emit( 'receive_reaction', newReaction )
                io.to( senderSocketId ).emit( 'receive_reaction', newReaction )
            } catch ( err ) {
                //socket_error event fire
                io.emit( 'socket_error', err.message )
            }
        } )

        //set user active
        socket.on( 'user_connected', async ( userId ) => {
            console.log( 'User', userId, 'connected' )
            addUser( socket.id, userId )
            const user = await User.findOne( userId )
            if ( !user || user.active === 1 ) return

            //update user
            try {
                user.active = 1
                await user.save()
            } catch ( err ) {
                console.log( err )
            }

        } )

        //disconnect
        socket.on( 'disconnect', async () => {
            const { userId } = getUser( socket.id )
            removeUser( socket.id )
            console.log( 'User', userId, 'disconnected' )

            //set user inactive
            const user = await User.findOne( userId )
            if ( !user || user.active === 0 ) return

            //update user
            try {
                user.active = 0
                await user.save()
            } catch ( err ) {
                console.log( err )
            }
        } )
    } )

}