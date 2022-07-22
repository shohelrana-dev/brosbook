import { User }                      from "@interfaces/user.interfaces"
import { appApi }                    from "./appApi"

type FetchData = {
    message: string
    success: boolean
    users?: User[]
    user?: User
}

export const usersApi = appApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        follow: build.mutation<FetchData, string>( {
            query: ( target ) => ( {
                url: `users/follow?target=${ target }`,
                method: 'POST',
                credentials: 'include'
            } ),
        } ),
        unfollow: build.mutation<FetchData, string>( {
            query: ( target ) => ( {
                url: `users/unfollow?target=${ target }`,
                method: 'POST',
                credentials: 'include'
            } ),
        } ),
    } ),
} )

export const { useFollowMutation, useUnfollowMutation } = usersApi