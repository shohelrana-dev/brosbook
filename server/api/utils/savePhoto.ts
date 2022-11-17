import { v4 as uuidv4 } from "uuid"
import path             from "path"
import Media            from "@entities/Media"
import { PhotoSource }    from "@api/enums"
import { UploadedFile } from "express-fileupload"

interface SavePhoto {
    file: UploadedFile
    source: PhotoSource
    userId: string
    sourceId?: string
}

export default async function savePhoto( { file, source, userId, sourceId }: SavePhoto ): Promise<string> {
    const type = path.extname( file.name )
    const name      = process.env.APP_NAME + '_image_' + uuidv4() + type
    const url       = `${ process.env.SERVER_URL }/images/${ name }`
    const photoPath = path.join( process.cwd(), 'server/public/images', name )

    try {
        await file.mv( photoPath )
        await Media.create( { name, url, source, userId, sourceId, type } ).save()
        return url
    } catch ( err ) {
        console.log( err )
        throw new Error( 'Media could not be saved' )
    }
}