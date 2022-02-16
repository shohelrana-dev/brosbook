import { Seeder, Factory } from "typeorm-seeding";
import User from "../entities/User";

export class CreateUser implements Seeder {
    public async run(factory: Factory): Promise<void> {
        await factory(User)().create()
        await factory(User)().create()
        await factory(User)().create()
        await factory(User)().create()
        await factory(User)().create()
    }
}