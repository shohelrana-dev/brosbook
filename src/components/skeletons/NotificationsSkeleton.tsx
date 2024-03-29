import Skeleton from 'react-loading-skeleton'

export default function NotificationsSkeleton( { count = 5 } ){
    return (
        <>
            <p className='text-center my-2 text-gray-500'>Loading...</p>
        
            { Array.from( { length: count } ).map( (_, i) => (
                <div key={i} className="px-3 py-2 mb-3 flex flex-wrap gap-3 items-center">
                    <Skeleton width={ 45 } height={ 45 } circle/>
                    <div>
                        <div className="flex flex-wrap gap-3 mb-1 items-center">
                            <Skeleton width={ 110 } height={ 12 }/>
                            <Skeleton height={ 8 } width={ 45 }/>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-1 items-center">
                            <Skeleton width={ 80 } height={ 9 }/>
                            <Skeleton width={ 30 } height={ 6 }/>
                        </div>
                    </div>
                </div>
            ) ) }
        </>
    )
}