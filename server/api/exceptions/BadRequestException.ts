import HttpException from "@exceptions/HttpException"

export default class BadRequestException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 400
        this.name = 'BadRequestException'
    }
}