import { NextFunction, Request, Response } from 'express'
import HttpException from '@exceptions/HttpException'

export default function errorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
    console.log(error)

    if (error instanceof HttpException) {
        return error.send(res)
    }

    res.status(500).json({message: 'Server error'})
}