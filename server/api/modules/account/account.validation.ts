import { body, ValidationChain } from "express-validator"

class AccountValidation {

    public updateProfile = (): ValidationChain[] => {
        return [
            body('firstName')
                .trim()
                .isLength({ min: 1 })
                .withMessage('First Name required.'),

            body('lastName')
                .trim()
                .isLength({ min: 1 })
                .withMessage('Last Name required.'),

            body('username')
                .trim()
                .isLength({ min: 1 })
                .withMessage('Username required.'),

            body('bio')
                .trim()
                .isLength({ min: 5 })
                .withMessage('Bio should be at least min 5 characters.'),

            body('phone')
                .trim()
                .isMobilePhone('bn-BD')
                .withMessage('Phone number should be bangladeshi mobile number.'),

            body('location')
                .trim()
                .isLength({ min: 1 })
                .withMessage('Location required.'),

            body('birthdate')
                .isLength({ min: 1 })
                .withMessage('Birthdate required.')
                .isISO8601()
                .toDate()
                .withMessage('Birthdate should be valid date'),

            body('gender')
                .trim()
                .isLength({ min: 1 })
                .withMessage('Gender required.')
        ]
    }

    public changePassword = (): ValidationChain[] => {
        return [
            body('currentPassword')
                .trim()
                .isLength({ min: 1 })
                .withMessage('Current Password required.'),

            body('newPassword')
                .trim()
                .isLength({ min: 1 })
                .withMessage('New Password required.'),

            body('confirmNewPassword')
                .trim()
                .isLength({ min: 1 })
                .withMessage('Confirm New Password required.')
                .custom((value, { req }) => {
                    if (req.body.newPassword !== value) {
                        throw new Error('New password and confirm new password should be the same.')
                    }
                    return true
                })
        ]
    }
}

export default AccountValidation