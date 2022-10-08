import { Request } from "express"
import bcrypt      from "bcrypt"

import HttpError from "@utils/http.error"
import Profile   from "@entities/Profile"
import User             from "@entities/User"
import httpStatus       from "http-status"
import savePhoto        from "@utils/savePhoto"
import { PhotoType }    from "@api/enums"
import { UploadedFile } from "express-fileupload"

export default class AccountService {

    public async updateProfile( req: Request ){
        const { firstName, lastName, bio, phone, location, birthdate, gender } = req.body
        const { profilePhoto, coverPhoto }                                     = req.files || {}


        //save profile photo
        const profilePhotoUrl = profilePhoto ? await savePhoto( {
            file: profilePhoto as UploadedFile,
            type: PhotoType.PROFILE,
            userId: req.user.id
        } ) : null
        //save cover photo
        const coverPhotoUrl   = coverPhoto ? await savePhoto( {
            file: coverPhoto as UploadedFile,
            type: PhotoType.COVER,
            userId: req.user.id
        } ) : null

        let profile = await Profile.findOneBy( { username: req.user.username } )
        if( ! profile ){
            if( coverPhotoUrl ){
                Profile.create( {
                    username: req.user.username,
                    bio,
                    phone,
                    location,
                    gender,
                    coverPhoto: coverPhotoUrl
                } )
            } else{
                profile = Profile.create( { username: req.user.username, bio, phone, location, gender } )
            }
        } else{
            profile.bio       = bio
            profile.phone     = phone
            profile.location  = location
            profile.birthdate = birthdate
            profile.gender    = gender
            if( coverPhotoUrl ){
                profile.coverPhoto = coverPhotoUrl
            }
        }

        try {
            await profile.save()
            if( profilePhotoUrl ){
                return await User.update( { username: req.user.username }, {
                    firstName, lastName, photo: profilePhotoUrl
                } )
            }
            return await User.update( { username: req.user.username }, {
                firstName, lastName
            } )
        } catch ( e ) {
            console.log( e )
            throw new HttpError( "Profile couldn't be updated", httpStatus.CONFLICT )
        }
    }

    public async changePassword( req: Request ){
        const { oldPassword, newPassword } = req.body

        const user = await User.findOneBy( { username: req.user.username } )

        if( ! user ) throw new HttpError( "Password couldn't be change", httpStatus.CONFLICT )

        const isMatched = await bcrypt.compare( oldPassword, user.password )

        if( ! isMatched ) throw new HttpError( "Old password didn't match", httpStatus.UNPROCESSABLE_ENTITY )

        user.password = await bcrypt.hash( newPassword, 6 )

        try {
            await user.save()
        } catch ( err ) {
            throw new HttpError( "Password couldn't be change", httpStatus.CONFLICT )
        }
    }
}