import { Alert } from "@mui/material"

export default function Error({ isError, message }: { message?: string, isError?: boolean }) {
    if ( !message && typeof isError === "undefined" ) {
        return null
    }

    return (
        <Alert severity="error">{ message ? message : "An error has occured!" }</Alert>
    )
}