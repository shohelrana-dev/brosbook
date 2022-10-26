import { RequestHandler } from 'express'
import {validate} from "class-validator"
import {plainToInstance} from "class-transformer"
import UnprocessableEntityException from "@exceptions/UnprocessableEntityException"
import mapErrors from "@utils/mapErrors"

const validationMiddleware = (type: any): RequestHandler => async (req, res, next) => {
    const errors = await validate(plainToInstance(type, req.body))

    if(errors.length > 0){
       return next(new UnprocessableEntityException('Validation error',   mapErrors(errors)))
    }
    next()
}

export default validationMiddleware