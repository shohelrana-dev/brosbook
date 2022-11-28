import {Auth} from "@api/types/index.types"
import Relationship from "@entities/Relationship"
import User from "@entities/User"

export default async function formatUser(user: User, auth: Auth): Promise<User>{
    const relationship = await Relationship.findOneBy({followerId: auth.user.id, followedId: user.id})

    user.isViewerFollow = Boolean(relationship)
    delete user.password

    return user
}