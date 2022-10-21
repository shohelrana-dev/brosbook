//dependencies
import { Request, Response, NextFunction } from 'express'
import HttpError                           from '@utils/httpError'
import httpStatus                          from "http-status"

const notFoundMiddleware = async( _: Request, __: Response, next: NextFunction ) => {
    next( new HttpError( httpStatus.NOT_FOUND, 'The route is not available' ) )
}

export default notFoundMiddleware