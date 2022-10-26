import HttpException from "@exceptions/HttpException"

export default class NotAcceptableException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 406
        this.name = 'NotAcceptableException'
    }
}