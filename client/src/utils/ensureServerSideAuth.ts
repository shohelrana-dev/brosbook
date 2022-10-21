import { GetServerSidePropsContext } from "next"
import { isUserAuthenticated }       from "@utils/isUserAuthenticated"
import redirect                      from "@utils/redirect"

export default async function ensureServerSideAuth( ctx: GetServerSidePropsContext ){
    try {
        await isUserAuthenticated( ctx )
    } catch ( e ) {
        redirect( ctx, '/auth/login' )
    }
    return { props: {} }
}