import User from '@entities/User'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default async (req: Request, _: Response, next: NextFunction) => {
    try {
        let jwt_token = ''
        const { access_token } = req.cookies
        const { authorization } = req.headers

        if (access_token) {
            jwt_token = access_token
        } else if (authorization) {
            jwt_token = authorization.split(' ')[1]
        } else {
            return next()
        }

        const { email }: any = jwt.verify(jwt_token, process.env.JWT_SECRET!)
        const user = await User.findOneOrFail({ email })
        
        if (user) {
            req.isAuthenticated = true
            req.user = user
        }

        next()
    } catch (err) {
        console.log(err)
        next()
    }
}