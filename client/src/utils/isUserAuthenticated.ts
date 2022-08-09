import { GetServerSidePropsContext } from "next";

export async function isUserAuthenticated( context: GetServerSidePropsContext ){
    try {
        const access_token = context.req.cookies.access_token

        const response = await fetch( `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/auth/me`, {
            headers: { "Authorization": "Bearer " + access_token }
        } )
        const data     = await response.json()

        //check user
        if( data.success && data.user ){
            return true
        }
        await Promise.reject( 'Unauthenticated!' )
    } catch ( err ) {
        await Promise.reject( 'Unauthenticated!' )
    }
}