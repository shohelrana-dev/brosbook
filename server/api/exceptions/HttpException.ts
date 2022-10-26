import { Response } from "express"

export default class HttpException extends Error {
    constructor(message: string, public statusCode?: number) {
            super(message)
    }

    public send(res: Response) {
        res.status(this.statusCode).json({
            message: this.message,
            statusCode: this.statusCode || 500
        })
    }
}