import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator'
import User from "@entities/User"
import argon2 from "argon2"

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExist implements ValidatorConstraintInterface {
    async validate(username: string, args: ValidationArguments) {
        try {
            await User.findOneByOrFail({username})
            return false
        }catch (e) {
            return true
        }
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'username already taken'
    }
}

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExist implements ValidatorConstraintInterface {
    async validate(email: string, args: ValidationArguments) {
        try {
            await User.findOneByOrFail({email})
            return false
        }catch (e) {
            return true
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'already have an account with the email address'
    }
}

@ValidatorConstraint({ async: true })
export class IsUsernameOrEmailNotExist implements ValidatorConstraintInterface {
    async validate(username: string, args: ValidationArguments) {
        try {
            await User.findOneOrFail({
                where: [{username}, {email: username}]
            })
            return true
        }catch (e) {
            return false
        }
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'account doesn\'t exist with this username or email'
    }
}

@ValidatorConstraint({ async: true })
export class MatchValue implements ValidatorConstraintInterface {
    async validate(value: string, args: ValidationArguments) {
        const [propertyName] = args.constraints;
        if(value === (args.object as any)[propertyName]){
            return true
        }
        return false
    }
    defaultMessage(args?: ValidationArguments): string {
        return `should be same as ${args.constraints[0]}`
    }
}


@ValidatorConstraint({ async: true })
export class IsPasswordValid implements ValidatorConstraintInterface {
    async validate(password: string, args: ValidationArguments) {
        const {username} = args.object as any
        try {
            const user = await User.findOneOrFail({
                where: [{username}, {email: username}]
            })
            const isPasswordMatched = await argon2.verify(user.password, password)
            if(isPasswordMatched){
                return true
            }
            return  false
        }catch (e) {
            return false
        }
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'invalid password'
    }
}
