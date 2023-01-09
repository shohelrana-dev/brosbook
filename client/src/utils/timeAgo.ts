import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale( en )
export const timeAgoInstance = new TimeAgo( 'en-US' )

export default function timeAgo( time: string ): string | null{
    if( ! time ) return null

    return timeAgoInstance.format( new Date( time ), 'twitter-now' )
}