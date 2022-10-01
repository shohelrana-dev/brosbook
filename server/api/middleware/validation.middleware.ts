import { NextFunction, Request, Response } from "express"
import { validationResult }                from "express-validator"
import HttpException                       from "@exceptions/http.exception"
import httpStatus                          from "http-status"

export function validationMiddleware( req: Request, res: Response, next: NextFunction ){
    const errors = validationResult( req )
    if( errors.isEmpty() ){
        next()
    } else{
        next( new HttpException( httpStatus.UNPROCESSABLE_ENTITY, 'Validation failed.', errors.mapped() ) )
    }
}