import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import HttpError            from "@utils/httpError"
import httpStatus           from "http-status"

export function validationMiddleware( req: Request, res: Response, next: NextFunction ){
    const errors = validationResult( req )
    if( errors.isEmpty() ){
        next()
    } else{
        next( new HttpError( httpStatus.UNPROCESSABLE_ENTITY, 'Validation failed.', {errors: errors.mapped()} ) )
    }
}