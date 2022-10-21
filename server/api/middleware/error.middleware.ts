import { NextFunction, Request, Response } from 'express'
import HttpError                           from '@utils/httpError'
import httpStatus                          from "http-status"

export default function errorMiddleware( error: HttpError, req: Request, res: Response, _: NextFunction ){
    const status  = error.code || httpStatus.INTERNAL_SERVER_ERROR
    const code    = error.code || httpStatus.INTERNAL_SERVER_ERROR
    const meta    = error.meta || {}
    const message = error.message || 'Ops! An unexpected error occurred during the request.'

    console.log( '=======================Error log from server====================' )
    console.log( error )
    console.log( '=======================Error log from server====================' )

    res.status( status ).json( {
        status,
        code,
        message,
        ...meta
    } )
}