import { shallowEqual } from "react-redux"


const listQueryExtraDefinitions = {
    serializeQueryArgs: ( { queryArgs }: any ) => {
        if(typeof  queryArgs === 'object'){
            const newQueryArgs = {...queryArgs}
            delete newQueryArgs.page

            return newQueryArgs
        }

        return undefined
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
        return !shallowEqual(currentArg, previousArg)
    }
}

export default listQueryExtraDefinitions