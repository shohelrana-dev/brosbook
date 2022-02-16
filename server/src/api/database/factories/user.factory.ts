import User from "../entities/User"
import Faker from "faker"
import { define } from "typeorm-seeding"
import bcrypt from "bcrypt"

define(User, (faker: typeof Faker) => {
    let { name, internet, phone } = faker
    let password = bcrypt.hashSync('secret', 6)

    let user = new User()
    user.firstName = name.firstName()
    user.email = internet.email()
    user.password = password

    return user
})