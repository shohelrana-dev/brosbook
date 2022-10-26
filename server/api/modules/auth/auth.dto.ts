import {IsEmail, IsNotEmpty, MaxLength, Length, Validate} from "class-validator"
import {
    IsEmailAlreadyExist, IsPasswordValid,
    IsUsernameAlreadyExist,
    IsUsernameOrEmailNotExist,
    MatchValue
} from "@utils/customValidation"

export class SignupUserDTO {
    @MaxLength(48)
    @IsNotEmpty()
    firstName: string

    @MaxLength(48)
    @IsNotEmpty()
    lastName: string

    @Validate(IsUsernameAlreadyExist)
    @Length(5, 20)
    @IsNotEmpty()
    username: string

    @Validate(IsEmailAlreadyExist)
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Length(6, 30)
    @IsNotEmpty()
    password: string
}

export class LoginUserDTO {
    @Validate(IsUsernameOrEmailNotExist)
    @IsNotEmpty()
    username: string

    @Validate(IsPasswordValid)
    @IsNotEmpty()
    password: string
}

export class ForgotPasswordDTO {
    @Validate(IsUsernameOrEmailNotExist)
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class ResetPasswordDTO {
    @Length(6, 30)
    @IsNotEmpty()
    password: string

    @Validate(MatchValue, ['password'], {message: 'confirm password and password should be same'})
    @Length(6, 30)
    @IsNotEmpty()
    confirmPassword: string

    token: string
}