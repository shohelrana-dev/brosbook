import HttpException from "@exceptions/HttpException"
import {Response} from "express";

export default class UnprocessableEntityException extends HttpException{
    constructor(message: string, public errors?: any) {
        super(message)
        this.statusCode = 422
        this.name = 'UnprocessableEntityException'
    }

    public send(res: Response) {
        res.status(this.statusCode).json({
            message: this.message,
            statusCode: this.statusCode,
            errors: this.errors
        })
    }
}