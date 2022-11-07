import React from 'react'
import {useGetCurrentUserQuery} from "@services/usersApi"

function Boot() {
    useGetCurrentUserQuery()

    return null
}

export default Boot;