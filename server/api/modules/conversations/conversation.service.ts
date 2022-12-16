import { Auth }            from "@api/types/index.types"
import Conversation        from "@entities/Conversation"
import BadRequestException from "@exceptions/BadRequestException"
import NotFoundException   from "@exceptions/NotFoundException"
import { appDataSource }   from "@config/data-source.config"
import UserService         from "@modules/users/user.service"
import Message             from "@entities/Message"

export default class ConversationService {
    public readonly repository        = appDataSource.getRepository( Conversation )
    public readonly messageRepository = appDataSource.getRepository( Message )
    public readonly userService       = new UserService()

    public async createConversation( participantId: string, auth: Auth ): Promise<Conversation>{
        if( ! participantId ) throw new BadRequestException( 'Participant id is empty.' )

        const user        = await this.userService.repository.findOneBy( { id: auth.user.id } )
        const participant = await this.userService.repository.findOneBy( { id: participantId } )

        if( ! participant ) throw new NotFoundException( 'Participant user doesn\'t exists.' )

        const conversation = new Conversation()
        conversation.user1 = user
        conversation.user2 = participant
        await this.repository.save( conversation )

        return conversation
    }
}