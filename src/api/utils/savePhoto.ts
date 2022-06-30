import { v4 as uuidv4 } from "uuid"
import path             from "path"
import Photo            from "@entities/Photo"
import { PhotoType }    from "@api/enums"
import { UploadedFile } from "express-fileupload"

interface savePhotoProps {
    file: UploadedFile
    type: PhotoType
    userId: number
    sourceId?: number
}

export default async function savePhoto( { file, type, userId, sourceId }: savePhotoProps ) {
    const caption   = file.name.replace( path.extname( file.name ), '' )
    const name      = process.env.APP_NAME + '_image_' + uuidv4() + path.extname( file.name )
    const url       = `${ process.env.SERVER_URL }/images/${ name }`
    const photoPath = path.resolve( process.cwd(), 'public/images', name )
    try {
        await file.mv( photoPath )
        await Photo.create( { caption, name, url, type, userId, sourceId } ).save()
        return url
    } catch ( err ) {
        console.log( err )
        throw new Error( 'Photo could not be saved' )
    }
}