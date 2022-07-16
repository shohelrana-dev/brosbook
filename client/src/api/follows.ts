import API from "@utils/API"

const followsApi = {
    addFollowing: ( username: string ) => API.post( `follows/following/${ username }` ),
    removeFollowing: ( username: string ) => API.delete( `follows/following/${ username }` )
}

export default followsApi