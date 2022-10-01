import { NextFunction, Request, Response } from 'express'
import HttpException                       from '@exceptions/http.exception'
import httpStatus                          from "http-status"

export default function errorMiddleware( error: HttpException, req: Request, res: Response, next: NextFunction ){
    const status: number  = error.status || httpStatus.INTERNAL_SERVER_ERROR
    const message: string = error.message || 'Ops! Something went wrong'

    console.log( '=======================Error message from server====================' )
    console.log( error.message )
    console.log( '=======================Error message from server====================' )

    if( error.errors ){
        return res.status( status ).json( {
            status,
            message,
            errors: error.errors
        } )
    }
    return res.status( status ).json( {
        status,
        message
    } )
}