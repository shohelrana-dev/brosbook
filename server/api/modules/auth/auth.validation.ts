import { check, ValidationChain } from "express-validator"
import bcrypt                     from "bcrypt"
import User                       from "@entities/User"

class AuthValidation {

    public signup = (): ValidationChain[] => {
        return [
            check( 'firstName' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'First Name required!' ),

            check( 'lastName' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Last Name required!' ),

            check( 'username' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Username required!' )
                .custom( this.checkUsernameNotExists ),

            check( 'email' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Email required!' )
                .isEmail()
                .withMessage( 'Email address is not valid!' )
                .custom( this.checkEmailNotExists ),

            check( 'password' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Password required!' )
                .isLength( { min: 4, max: 16 } )
                .withMessage( 'Password must be min 4 to 16 characters' )
        ]
    }

    public login = (): ValidationChain[] => {
        return [
            check( 'username' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Username required!' )
                .custom( this.checkUsernameExists ),

            check( 'password' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Password required!' )
                .custom( this.checkValidPassword ),
        ]
    }

    public forgotPassword = (): ValidationChain[] => {
        return [
            check( 'email' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Email required!' )
                .isEmail()
                .withMessage( 'Invalid email address!' )
                .custom( this.checkEmailExists ),
        ]
    }

    public resetPassword = (): ValidationChain[] => {
        return [
            check( 'password' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Password required!' )
                .isLength( { min: 4, max: 16 } )
                .withMessage( 'Password must be min 4 to 16 characters' ),

            check( 'confirmPassword' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Confirm Password required!' )
                .custom( ( value, { req } ) => {
                    if( value !== req.body.password ){
                        throw new Error( 'Passwords must be same' )
                    }
                    return true
                } )
        ]
    }

    private checkUsernameNotExists = async( username: string ): Promise<void> => {
        const user = await User.findOneBy( { username } )
        if( user ){
            throw new Error( 'The username already exists!' )
        }
    }

    private checkEmailNotExists = async( email: string ): Promise<void> => {
        const user = await User.findOneBy( { email } )
        if( user ){
            throw new Error( 'The email address already exists!' )
        }
    }

    private checkEmailExists = async( email: string ): Promise<void> => {
        try {
            await User.findOneByOrFail( { email } )
        } catch ( err ) {
            throw new Error( 'The email address not exists!' )
        }
    }

    private checkUsernameExists = async( username: string ): Promise<void> => {
        try {
            await User.findOneOrFail( {
                where: [
                    { email: username },
                    { username }
                ]
            } )
        } catch ( err ) {
            throw new Error( 'User not found with the email address or username' )
        }
    }

    private checkValidPassword = async( _: any, { req }: any ): Promise<void> => {
        const { username, password } = req.body
        const user                   = await User.findOne( {
            where: [
                { email: username },
                { username }
            ]
        } )

        if( user ){
            let isValidPassword = await bcrypt.compare( password, user.password )
            if( ! isValidPassword ){
                throw new Error( 'Password is incorrect!' )
            }
        }
    }
}

export default AuthValidation