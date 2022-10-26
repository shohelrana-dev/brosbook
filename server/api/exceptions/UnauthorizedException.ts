import HttpException from "@exceptions/HttpException"

export default class UnauthorizedException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 401
        this.name = 'UnauthorizedException'
    }
}