import DefaultTags from "@components/common/DefaultTags"

export default function Head(){
    return (
        <>
            <DefaultTags/>
            <title>{ `Email verification | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}