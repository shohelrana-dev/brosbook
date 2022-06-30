import nodemailer, { SentMessageInfo } from 'nodemailer'
import { OAuth2Client }                from 'google-auth-library'

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const REDIRECT_URI  = 'https://developers.google.com/oauthplayground'

//make google auth
const authClient = new OAuth2Client( CLIENT_ID, CLIENT_SECRET, REDIRECT_URI )
authClient.setCredentials( { refresh_token: REFRESH_TOKEN } )

const sendEmail = async ( to: string, subject: string, html: string ): Promise<SentMessageInfo> => {
    try {
        const { token }   = await authClient.getAccessToken()
        const transporter = nodemailer.createTransport( {
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: token!
            }
        } )

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        }

        return await transporter.sendMail( mailOptions )
    } catch ( err ) {
        console.log( err )
        throw new Error( 'Email could not be send' )
    }
}

export default sendEmail