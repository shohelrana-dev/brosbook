//dependencies
import 'reflect-metadata'
import express, { Application } from 'express'
import morgan                   from 'morgan'
import dotenv                   from "dotenv"
import cors                     from 'cors'
import path                     from "path"
import cookieParser             from "cookie-parser"
import http                     from "http"

//env config
dotenv.config()


//internal import
import notFound    from "@middleware/not-found"
import error       from '@middleware/error'
import currentUser from '@middleware/current-user'
import socketInit  from "@api/socket"
import fileUpload from "express-fileupload"
import routes     from '@routes/index.route'

//Application
const app: Application = express()

//create server
const server = http.createServer( app )
//socket server init
socketInit( server )

//initial configs
app.use( morgan( 'dev' ) )
app.use( express.json() )
app.use( express.urlencoded( { extended: false } ) )
app.use( express.static( path.join( __dirname, '/../../public' ) ) )
app.use( cors( {
    credentials: true,
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200
} ) )
app.use( cookieParser( process.env.COOKIE_SECRET ) )
app.use( fileUpload() )

//static path
app.use( express.static( path.resolve( __dirname, '../../public' ) ) )

//set current user
app.use( currentUser )

//app routes
app.use( routes )

// handle error
app.use( notFound )
app.use( error )

export default server