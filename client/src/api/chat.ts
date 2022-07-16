import API from "@utils/API"


const chatApi = {
    fetchConversations: () => API.get( '/chat/conversations' ),
    fetchOneConversation: ( identifier: string ) => API.get( `/chat/conversations/${ identifier }` ),
    fetchMessages: ( identifier: string ) => API.get( `/chat/messages/${ identifier }` ),
    createConversation: ( participantId: number ) => API.post( '/chat/conversations', { participantId } ),
}

export default chatApi
