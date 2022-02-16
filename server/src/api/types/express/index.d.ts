declare namespace Express {
    export interface Request {
        user: {
            id: number,
            firstName: string,
            lastName: string,
            username: string,
            email: string,
            photo: string,
        }
        isAuthenticated?: boolean
    }
}