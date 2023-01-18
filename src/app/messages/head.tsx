import DefaultTags from "@components/common/DefaultTags"

export default function Head(){
    return (
        <>
            <DefaultTags/>
            <title>{ `Messages | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}