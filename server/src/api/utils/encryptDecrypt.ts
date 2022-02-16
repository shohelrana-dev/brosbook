//dependencies
import crypto from "crypto";

//vars
const algorithm = 'aes-256-cbc'
const key       = 'encryption_secret_389434345'

export const encrypt = ( text: string ) => {
    let cipher  = crypto.createCipher( algorithm, key )
    let crypted = cipher.update( text, 'utf8', 'hex' )
    crypted += cipher.final( 'hex' );
    return crypted;
}


export const decrypt = ( text: string ) => {
    let decipher = crypto.createDecipher( algorithm, key )
    let dec      = decipher.update( text, 'hex', 'utf8' )
    dec += decipher.final( 'utf8' );
    return dec;
}