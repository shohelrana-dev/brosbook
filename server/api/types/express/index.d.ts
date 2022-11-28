declare namespace Express {
    export interface Request {
        auth: {
            user?: {
                id: string,
                username: string,
                email: string
            }
            isAuthenticated: boolean
        }
    }
}