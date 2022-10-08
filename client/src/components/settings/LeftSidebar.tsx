import React         from 'react'
import Link          from "next/link";
import { useRouter } from "next/router";
import classNames    from "classnames";

function LeftSidebar() {
    //hooks
    const router = useRouter()

    return (
        <div className="w-4/12 p-4 lg:border-r-2 border-theme-gray">
            <Link href="/account/profile">
                <a className={ classNames( 'button text-left mb-2', {
                    "button-blue cursor-auto": router.pathname.endsWith( 'profile' )
                } ) }>
                    Edit Profile
                </a>
            </Link>
            <Link href="/account/password">
                <a className={ classNames( 'button text-left mb-2', {
                    "button-blue cursor-auto": router.pathname.endsWith( 'password' )
                } ) }>
                    Change Password
                </a>
            </Link>
        </div>
    )
}

export default LeftSidebar