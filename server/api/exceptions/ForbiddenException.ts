import HttpException from "@exceptions/HttpException"

export default class ForbiddenException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 403
        this.name = 'ForbiddenException'
    }
}