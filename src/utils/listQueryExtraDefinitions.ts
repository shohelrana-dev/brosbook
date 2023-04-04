const listQueryExtraDefinitions = {
    serializeQueryArgs: ( { endpointName }: any ) => {
        return endpointName
    },
    merge: ( currentCache: any, responseData: any ) => {
        if( responseData.currentPage > 1 ){
            return { ...responseData, items: [...currentCache.items, ...responseData.items] }
        }
        return responseData
    },
    forceRefetch: ( { currentArg, previousArg }: any ) => {
        if( currentArg?.page === 1 && previousArg?.page > 1 ){
            return false
        }
        return currentArg !== previousArg
    }
}

export default listQueryExtraDefinitions