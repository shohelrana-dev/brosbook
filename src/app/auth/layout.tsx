import React, {PropsWithChildren} from 'react'

function Layout({children}: PropsWithChildren) {
    return (
        <div className="auth-layout">{children}</div>
    )
}

export default Layout