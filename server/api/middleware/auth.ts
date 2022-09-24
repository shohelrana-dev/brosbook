//dependencies
import { NextFunction, Request, Response } from 'express'
import HttpException                       from '@exceptions/http.exception'
import httpStatus                          from "http-status"

export const ensureAuth = ( req: Request, _: Response, next: NextFunction ) => {
    if( req.isAuthenticated ){
        return next()
    }
    next( new HttpException( 'Unauthenticated user not allowed!', httpStatus.FORBIDDEN ) )
}

export const ensureGuest = ( req: Request, _: Response, next: NextFunction ) => {
    if( ! req.isAuthenticated ){
        return next()
    }
    next( new HttpException( 'Authenticated user not allowed!', httpStatus.FORBIDDEN ) )
}