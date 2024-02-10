import Image from 'next/image'
import { Message } from '~/interfaces/conversation.interfaces'
import cn from '~/utils/cn'

export default function Reactions({ message }: { message: Message }) {
   const { isMeSender, reactions } = message

   if (!reactions || reactions?.length < 1) return null

   return (
      <div
         className={cn(
            'absolute w-max -bottom-4 flex gap-x-1 justify-center p-[2px] bg-white rounded-full px-1',
            { 'left-2': isMeSender, 'right-2': !isMeSender }
         )}
      >
         {reactions.map((reaction) => (
            <Image
               key={reaction.id}
               width={18}
               height={18}
               src={reaction.url}
               alt="Reaction"
               className="w-[18px] h-[18px]"
            />
         ))}
      </div>
   )
}
