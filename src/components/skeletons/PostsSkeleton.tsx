import Skeleton from 'react-loading-skeleton'

export default function PostsSkeleton( { count = 3 } ){
    return (
        <>
            <p className='text-center my-2 text-gray-500'>Loading...</p>

            { Array.from( { length: count } ).map( (_, i) => (
                <div key={i} className="box bg-white p-5 mb-3">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <Skeleton width={ 48 } height={ 48 } circle/>
                            <div>
                                <div className="flex flex-wrap gap-2 mb-1">
                                    <Skeleton width={ 110 }/>
                                    <Skeleton height={ 10 } width={ 70 }/>
                                </div>
                                <Skeleton width={ 30 } height={ 8 }/>
                            </div>
                        </div>
                        <Skeleton width={ 22 } height={ 6 }/>
                    </div>
                    <Skeleton height={ 10 } count={ 3 }/>
                    <Skeleton height={ 10 } style={{width: "50%"}}/>
                    <div className="flex flex-wrap justify-around border-0 border-solid border-gray-50 border-t-2 border-b-2 py-1 mt-3">
                        <Skeleton width={ 22 } height={ 22 } circle/>
                        <Skeleton width={ 22 } height={ 22 } circle/>
                        <Skeleton width={ 22 } height={ 22 } circle/>
                    </div>
                </div>
            ) ) }
        </>
    )
}