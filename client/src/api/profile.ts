import API from "@utils/API"

const profileApi = {
    fetchUser: ( username: string ) => API.get( `/profile/${ username }` ),
    fetchPosts: ( username: string, page: number, limit?: number ) => API.get( `profile/${ username }/posts`, {
        params: { page, limit }
    } ),
    fetchFollowers: ( username: string, page: number, limit?: number ) => API.get( `profile/${ username }/followers`, {
        params: { page, limit }
    } ),
    fetchFollowing: ( username: string, page: number, limit?: number ) => API.get( `profile/${ username }/following`, {
        params: { page, limit }
    } ),
}

export default profileApi