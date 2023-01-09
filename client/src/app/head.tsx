export default function Head(){
    return (
        <>
            <meta property="og:site_name" content="brosbook"/>
            <meta property="twitter:card" content="summary"/>
            <meta property="og:type" content="website"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png"/>
            <title>{ process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook' }</title>
        </>
    )
}