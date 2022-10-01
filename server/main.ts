//dependencies
import app           from '@config/express.config'
import { AppDataSource } from "@config/data-source.config"

//server run
const PORT = process.env.SERVER_PORT || 4000;
app.listen( PORT, async() => {
    console.log( `🚀 Server listening on port ${ PORT }` )
    console.log( `======= ENV: ${ process.env.NODE_ENV } =======` )

    try {
        //make database connection
        await AppDataSource.initialize()
        console.log( "Data Source has been initialized!" )
    } catch ( err ) {
        console.error( "Error during Data Source initialization", err )
    }
} )