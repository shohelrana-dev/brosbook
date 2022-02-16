import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps( ctx: DocumentContext ) {
        const initialProps = await Document.getInitialProps( ctx )
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang='eng'>
                <Head>
                    <meta property="og:site_name" content="readit"/>
                    <meta property="twitter:card" content="summary"/>
                    <meta property="og:type" content="website"/>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap"
                        rel="stylesheet"/>
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument