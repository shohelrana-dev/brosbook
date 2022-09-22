//dependencies
import { NextFunction, Request, Response } from 'express'
import HttpException                       from '@modules/http.exception'

export const ensureAuth = (req: Request, _: Response, next: NextFunction) => {
    if (req.isAuthenticated) {
        return next()
    }
    next(new HttpException('Unauthenticated user not allowed!', 401))
}

export const ensureGuest = (req: Request, _: Response, next: NextFunction) => {
    if (!req.isAuthenticated) {
        return next()
    }
    next(new HttpException('Authenticated user not allowed!', 400))
}