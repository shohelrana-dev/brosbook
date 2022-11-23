import {NextRequest} from "next/server"

export default async function isAuthenticated(req: NextRequest) {
    const access_token = req.cookies.get('access_token')?.value
    const url = `${process.env["NEXT_PUBLIC_SERVER_API_URL"]}/users/me`

    try {
        const res = await fetch(url, {headers: {Authorization: `Bearer ${access_token}`}})
        if(res.ok){
            console.log('User authorized.')
            return true
        }
    }catch (err:any) {
        console.log('User unauthorized.')
        return false
    }
}