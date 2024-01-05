import Skeleton from 'react-loading-skeleton'

export default function UsersSkeleton( { count = 4 } ){
    return (
        <>
            <p className='text-center my-2 text-gray-500'>Loading...</p>

            { Array.from( { length: count } ).map( (_, i) => (
                <div key={i} className="flex flex-wrap gap-2 w-full mb-3">
                    <Skeleton width={ 45 } height={ 45 } circle/>
                    <div>
                        <Skeleton width={ 110 } height={ 10 }/>
                        <Skeleton width={ 80 } height={ 6 }/>
                        <div className="mb-[3px]"/>
                        <Skeleton width={200} height={ 8 }/>
                    </div>
                </div>
            ) ) }
        </>
    )
}