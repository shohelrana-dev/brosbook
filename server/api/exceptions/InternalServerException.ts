import HttpException from "@exceptions/HttpException"

export default class InternalServerException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 500
        this.name = 'InternalServerException'
    }
}