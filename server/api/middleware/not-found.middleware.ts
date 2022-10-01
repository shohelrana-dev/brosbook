//dependencies
import { Request, Response, NextFunction } from 'express'
import HttpException                       from '@exceptions/http.exception'

const notFoundMiddleware = async ( _: Request, __: Response, next: NextFunction) => {
    next(new HttpException('The route is not available', 404))
}

export default notFoundMiddleware