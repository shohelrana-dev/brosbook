import React from 'react'

export default function Head() {
    return (
        <>
            <meta property="og:site_name" content="brosbook"/>
            <meta property="twitter:card" content="summary"/>
            <meta property="og:type" content="website"/>
            <title>{process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'}</title>
            <link rel="shortcut icon" href="/images/favicon.png" />
        </>
    );
}