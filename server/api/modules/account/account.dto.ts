import {IsDateString, IsEnum, IsNotEmpty, IsPhoneNumber, Length, MaxLength, MinLength, Validate} from "class-validator"
import {IsUsernameAlreadyExist, MatchValue} from "@utils/customValidation"

export class ChangeUsernameDTO {
    @IsNotEmpty()
    password: string

    @Validate(IsUsernameAlreadyExist)
    @Length(5, 20)
    @IsNotEmpty()
    username: string
}

export class ChangePasswordDTO {
    @IsNotEmpty()
    currentPassword: string

    @Length(6, 30)
    @IsNotEmpty()
    newPassword: string

    @Validate(MatchValue, ['newPassword'], {message: 'confirm new password and password should be same'})
    @Length(6, 30)
    @IsNotEmpty()
    confirmNewPassword: string
}

export class UpdateProfileDTO {
    @MaxLength(20)
    @IsNotEmpty()
    firstName: string

    @MaxLength(20)
    @IsNotEmpty()
    lastName: string

    @MaxLength(2000)
    @MinLength(10)
    @IsNotEmpty()
    bio: string

    @IsPhoneNumber('BD')
    @IsNotEmpty()
    phone: string

    @IsNotEmpty()
    location: string

    @IsDateString()
    @IsNotEmpty()
    birthdate: string

    @IsEnum(['male', 'email'])
    @IsNotEmpty()
    gender: string
}