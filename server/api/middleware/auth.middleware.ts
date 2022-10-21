//dependencies
import { NextFunction, Request, Response } from 'express'
import HttpError                           from '@utils/httpError'
import httpStatus                          from "http-status"

export const ensureAuth = ( req: Request, _: Response, next: NextFunction ) => {
    if( req.isAuthenticated ){
        return next()
    }
    next( new HttpError( httpStatus.UNAUTHORIZED, 'Sorry, you are not allowed.' ) )
}

export const ensureGuest = ( req: Request, _: Response, next: NextFunction ) => {
    if( ! req.isAuthenticated ){
        return next()
    }
    next( new HttpError( httpStatus.BAD_REQUEST, 'Sorry, you are not allowed.' ) )
}