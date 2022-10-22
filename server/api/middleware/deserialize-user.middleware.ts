import User                                from '@api/entities/User'
import { NextFunction, Request, Response } from 'express'
import jwt                                 from 'jsonwebtoken'

export default async function deserializeUserMiddleware( req: Request, _: Response, next: NextFunction ){
    let jwt_token           = ''
    const { access_token }  = req.cookies
    const { authorization } = req.headers
    req.isAuthenticated     = false
    req.user                = {} as User

    if( authorization ){
        jwt_token = authorization.split( ' ' )[1]
    } else if( access_token ){
        jwt_token = access_token
    } else{
        return next()
    }

    try {
        const decoded = jwt.verify( jwt_token, process.env.JWT_SECRET! )

        if( decoded ){
            req.isAuthenticated = true
            req.user            = decoded as User
        }
    } catch ( err ) {
        console.log( err.message )
    }
    next()
}