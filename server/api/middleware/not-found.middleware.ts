//dependencies
import { Request, Response, NextFunction } from 'express'
import NotFoundException from "@exceptions/NotFoundException"

const notFoundMiddleware = async( _: Request, __: Response, next: NextFunction ) => {
    next( new NotFoundException( 'The route is not available' ) )
}

export default notFoundMiddleware