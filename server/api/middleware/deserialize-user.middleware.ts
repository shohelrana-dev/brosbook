import User                                from '@entities/User'
import { NextFunction, Request, Response } from 'express'
import jwt                                 from 'jsonwebtoken'

export default async function deserializeUserMiddleware( req: Request, _: Response, next: NextFunction ){
    try {
        let jwt_token           = ''
        const { access_token }  = req.cookies
        const { authorization } = req.headers

        if( authorization ){
            jwt_token = authorization.split( ' ' )[1]
        } else if( access_token ){
            jwt_token = access_token
        } else{
            return next()
        }

        const decoded = jwt.verify( jwt_token, process.env.JWT_SECRET! )

        if( decoded ){
            req.isAuthenticated = true
            req.user            = decoded as User
        }

        next()
    } catch ( err ) {
        console.log( err.message )
        next()
    }
}