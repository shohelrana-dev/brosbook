import SidebarLayout from "@components/common/SidebarLayout"
import { getPostById } from "@services/index"
import { cookies } from "next/headers"

export default async function Page( { params }: any ){
    const data = await getPostById( params.id, cookies() )

    return (
        <SidebarLayout>
            <p>{ data?.body }</p>
            <img src={ data?.image?.url } className="img-fluid"/>
        </SidebarLayout>
    )
}