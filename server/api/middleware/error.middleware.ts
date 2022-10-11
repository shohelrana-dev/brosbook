import { NextFunction, Request, Response } from 'express'
import HttpError                           from '@utils/httpError'
import httpStatus                          from "http-status"

export default function errorMiddleware( error: HttpError, req: Request, res: Response, _: NextFunction ){
    const status  = error.code || httpStatus.INTERNAL_SERVER_ERROR
    const code    = error.code || httpStatus.INTERNAL_SERVER_ERROR
    const meta    = error.meta || {}
    const message = error.message || 'Ops! An unexpected error occurred during the request.'

    console.log( '=======================Error message from server====================' )
    console.log( error.message )
    console.log( '=======================Error message from server====================' )

    res.status( status ).json( {
        status,
        code,
        message,
        ...meta
    } )
}