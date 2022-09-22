import { NextFunction, Request, Response } from 'express'
import HttpException                       from '@exceptions/http.exception'
import httpStatus      from "http-status"

const error = ( error: HttpException, _: Request, res: Response, __: NextFunction ) => {
    const status: number  = error.status || httpStatus.INTERNAL_SERVER_ERROR
    const message: string = error.message || 'Something went wrong'

    console.log( '==================Error==================' )
    console.log( error )
    console.log( '==================Error==================' )

    res.status( status ).json( {
        success: false,
        message
    } )
};

export default error