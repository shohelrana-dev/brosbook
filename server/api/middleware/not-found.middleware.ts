//dependencies
import { Request, Response, NextFunction } from 'express'
import HttpException                       from '@exceptions/http.exception'
import httpStatus                          from "http-status"

const notFoundMiddleware = async( _: Request, __: Response, next: NextFunction ) => {
    next( new HttpException( httpStatus.NOT_FOUND, 'The route is not available' ) )
}

export default notFoundMiddleware