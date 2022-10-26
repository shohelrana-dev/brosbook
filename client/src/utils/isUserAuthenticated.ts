import { GetServerSidePropsContext } from "next"

export async function isUserAuthenticated( context: GetServerSidePropsContext ){
    const access_token = context.req.cookies.access_token

    const response = await fetch( `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/users/me`, {
        headers: { "Authorization": "Bearer " + access_token }
    } )

    if( response.status === 200 ) return

    throw new Error( 'Unauthorized!' )
}