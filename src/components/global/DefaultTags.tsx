import React from 'react'

function DefaultTags(){
    return (
        <>
            <meta charSet="UTF-8"/>
            <meta name="viewport"
                  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
            <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
            <meta name="color-scheme" content="light"/>
            <meta name="theme-color" content="#FFFFFF"/>
            <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME}/>
            <meta property="twitter:card" content="summary"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png"/>
        </>
    )
}

export default DefaultTags