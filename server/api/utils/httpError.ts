import User from "@api/entities/User"

type Meta = {
    errors?: {}
    user?: User
}

export default class HttpError extends Error {
    public code: number
    public message: string
    public meta: Meta

    constructor( code: number, message: string, meta?: Meta ){
        super( message )
        this.code    = code
        this.message = message
        this.meta    = meta
    }
}