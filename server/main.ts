//dependencies
import { createConnection } from 'typeorm'

import app            from '@config/express.config'
import databaseConfig from '@config/database.config'

//server run
const PORT = process.env.SERVER_PORT || 4000;
app.listen( PORT, async () => {
    console.log( `🚀 Server listening on port ${ PORT }` )
    console.log( `======= ENV: ${ process.env.NODE_ENV } =======` )

    try {
        //make database connection
        await createConnection( databaseConfig )
        console.log( 'Database connected' )
    } catch ( err ) {
        console.log( err.message )
    }
} )