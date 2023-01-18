import DefaultTags from "@components/common/DefaultTags"

export default function Head(){
    return (
        <>
            <DefaultTags/>
            <title>{ `Signup | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}