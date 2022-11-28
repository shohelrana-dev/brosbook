//dependencies
import { NextFunction, Request, Response } from 'express'
import UnauthorizedException from "@exceptions/UnauthorizedException"

const authMiddleware = ( req: Request, _: Response, next: NextFunction ) => {
    if( req.auth.isAuthenticated ){
        return next()
    }
    next( new UnauthorizedException( 'You are not currently logged in.' ) )
}
export default authMiddleware