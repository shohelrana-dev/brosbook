import { v4 as uuidv4 } from "uuid"
import path             from "path"
import Media            from "@api/entities/Media"
import { PhotoSource }    from "@api/enums"
import { UploadedFile } from "express-fileupload"

interface savePhotoProps {
    file: UploadedFile
    source: PhotoSource
    userId: number
    sourceId?: number
}

export default async function savePhoto( { file, source, userId, sourceId }: savePhotoProps ) {
    const name      = process.env.APP_NAME + '_image_' + uuidv4() + path.extname( file.name )
    const url       = `${ process.env.SERVER_URL }/images/${ name }`
    const photoPath = path.resolve( process.cwd(), 'public/images', name )
    try {
        await file.mv( photoPath )
        await Media.create( { name, url, source, userId, sourceId } ).save()
        return url
    } catch ( err ) {
        console.log( err )
        throw new Error( 'Media could not be saved' )
    }
}