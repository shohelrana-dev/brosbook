import HttpException from "@exceptions/HttpException"

export default class NotFoundException extends HttpException{
    constructor(message:string) {
        super(message)
        this.statusCode = 404
        this.name = 'NotFoundException'
    }
}