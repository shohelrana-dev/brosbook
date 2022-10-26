import HttpException from "@exceptions/HttpException"

export default class ConflictException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 409
        this.name = 'ConflictException'
    }
}