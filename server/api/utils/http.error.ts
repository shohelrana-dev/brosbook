export default class HttpError extends Error {
    public status: number
    public message: string
    public errors: object

    constructor( status: number, message: string, errors?: object ){
        super( message )
        this.status  = status!
        this.message = message
        this.errors  = errors
    }
}