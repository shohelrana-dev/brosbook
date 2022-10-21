import { GetServerSidePropsContext } from "next"
import { isUserAuthenticated }       from "@utils/isUserAuthenticated"
import redirect                      from "@utils/redirect"

export default async function ensureServerSideGuest( ctx: GetServerSidePropsContext, redirectUrl = '/' ){
    try {
        await isUserAuthenticated( ctx )
        redirect( ctx, redirectUrl )
    } catch ( e ) {

    }
    return { props: {} }
}