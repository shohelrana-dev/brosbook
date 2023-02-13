import DefaultTags from "@components/global/DefaultTags"

export default function Head(){
    return (
        <>
            <DefaultTags/>
            <title>{ `Suggestions | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}