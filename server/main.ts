//dependencies
import { server }        from '@config/express.config'
import { appDataSource } from "@config/data-source.config"

//server run
const PORT = process.env.SERVER_PORT || 4000;
server.listen( PORT, async() => {
    console.log( `🚀 Server listening on port ${ PORT }` )
    console.log( `======= ENV: ${ process.env.NODE_ENV } =======` )

    try {
        //make database connection
        await appDataSource.initialize()
        console.log( "Data Source has been initialized!" )
    } catch ( err ) {
        console.error( "Error during Data Source initialization", err )
    }
} )