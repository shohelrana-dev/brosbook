import { GetServerSideProps, GetServerSidePropsContext } from "next"

async function isUserAuthenticated( context: GetServerSidePropsContext ){
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

export function withAuthServerSide( gssp: GetServerSideProps ){
    return async( context: GetServerSidePropsContext ) => {
        try {
            await isUserAuthenticated( context )
            return await gssp( context )
        } catch ( err: any ) {
            return {
                redirect: {
                    destination: '/auth/login',
                    statusCode: 302
                }
            }
        }
    }
}

export function withGuestServerSide( gssp: GetServerSideProps, redirectUrl: string = '/' ){
    return async( context: GetServerSidePropsContext ) => {
        try {
            await isUserAuthenticated( context )
            return {
                redirect: {
                    destination: redirectUrl,
                    statusCode: 302
                }
            }
        } catch ( err: any ) {
            return await gssp( context )
        }
    }
}
