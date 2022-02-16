import React         from 'react'
import Link          from "next/link";
import { useRouter } from "next/router";
import classNames    from "classnames";

function LeftSidebar() {
    //hooks
    const router = useRouter()

    return (
        <div className="w-3/12 p-4 lg:border-r-2 border-theme-gray">
            <Link href="/settings/edit_profile">
                <a className={ classNames( 'button text-left mb-2', {
                    "button-blue cursor-auto": router.pathname.endsWith( 'edit_profile' )
                } ) }>
                    Edit Profile
                </a>
            </Link>
            <Link href="/settings/change_password">
                <a className={ classNames( 'button text-left mb-2', {
                    "button-blue cursor-auto": router.pathname.endsWith( 'change_password' )
                } ) }>
                    Change Password
                </a>
            </Link>
        </div>
    )
}

export default LeftSidebar