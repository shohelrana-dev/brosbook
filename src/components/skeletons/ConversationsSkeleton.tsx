import Skeleton from 'react-loading-skeleton'

export default function ConversationsSkeleton( { count = 5 } ){
    return (
        <>
            <p className='text-center my-2 text-gray-500'>Loading...</p>
            
            { Array.from( { length: count } ).map( (_, i) => (
                <div key={i} className="card bg-white px-3 py-2 mb-3 flex flex-wrap gap-3 items-center">
                    <Skeleton width={ 48 } height={ 48 } circle/>
                    <div>
                        <div className="flex flex-wrap gap-2 mb-1 items-center">
                            <Skeleton width={ 110 } height={ 12 }/>
                            <Skeleton height={ 8 } width={ 40 }/>
                        </div>
                        <Skeleton width={ 80 } height={ 8 }/>
                    </div>
                </div>
            ) ) }
        </>
    )
}