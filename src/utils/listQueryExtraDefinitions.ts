import { shallowEqual } from "react-redux"


const listQueryExtraDefinitions = {
    serializeQueryArgs: ( { endpointName, queryArgs }: any ) => {
        const newQueryArgs = {...queryArgs}
        delete newQueryArgs.page

        if(queryArgs && Object.keys(queryArgs).length > 0){
            return `${endpointName}("${new URLSearchParams(newQueryArgs).toString()}")`
        }
        return endpointName
    },
    merge: ( currentCache: any, responseData: any ) => {
        if( responseData.currentPage > 1 ){
            return { ...responseData, items: [...currentCache.items, ...responseData.items] }
        }
        return responseData
    },
    forceRefetch: ( { currentArg, previousArg }: any ) => {
        console.log(previousArg,currentArg)
        if( currentArg?.page === 1 && previousArg?.page > 1 ){
            return false
        }
        return !shallowEqual(currentArg, previousArg)
    }
}

export default listQueryExtraDefinitions