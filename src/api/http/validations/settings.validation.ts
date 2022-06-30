import { body, ValidationChain } from "express-validator"

class SettingsValidation {

    public updateProfile = (): ValidationChain[] => {
        return [
            body( 'firstName' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'First Name is required.' ),

            body( 'lastName' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Last Name is required.' ),

            body( 'bio' )
                .trim()
                .isLength( { min: 5 } )
                .withMessage( 'Bio should be at least min 5 characters.' ),

            body( 'phone' )
                .trim()
                .isMobilePhone( 'bn-BD' )
                .withMessage( 'Phone number should be bangladeshi mobile number.' ),

            body( 'location' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Location is required.' ),

            body( 'birthdate' )
                .isLength( { min: 1 } )
                .withMessage( 'Birthdate is required.' )
                .isDate()
                .withMessage( 'Birthdate should be valid date' ),

            body( 'gender' )
                .trim()
                .custom( ( value ) => {
                    if ( value !== 'male' && value !== 'female' ) {
                        throw new Error( 'Gender is required.' )
                    }
                    return true
                } )
        ]
    }

    public changePassword = (): ValidationChain[] => {
        return [
            body( 'oldPassword' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Old Password is required.' ),

            body( 'newPassword' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'New Password is required.' ),

            body( 'confirmNewPassword' )
                .trim()
                .isLength( { min: 1 } )
                .withMessage( 'Confirm New Password is required.' )
                .custom( ( value, { req } ) => {
                    if ( req.body.newPassword !== value ) {
                        throw new Error( 'New password and confirm new password should be the same.' )
                    }
                    return true
                } )
        ]
    }
}

export default SettingsValidation