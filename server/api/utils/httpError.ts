import User from "@entities/User"

type ErrorMeta = {
    errorType?: string,
    errors?: {}
    user?: User
}

export default class HttpError extends Error {
    public code: number
    public message: string
    public meta: ErrorMeta

    constructor( code: number, message: string, meta?: ErrorMeta ){
        super( message )
        this.code    = code!
        this.message = message
        this.meta    = meta
    }
}