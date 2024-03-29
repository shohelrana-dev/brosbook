import Skeleton from 'react-loading-skeleton'

export default function CreatePostFormSkeleton(){
    return (
        <div className="card bg-white p-5 mb-3">
            <p className='text-center my-2 text-gray-500'>Loading...</p>
            <div className="text-center mb-4">
                <Skeleton width={ 110 }/>
            </div>
            <div className="mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <Skeleton width={ 48 } height={ 48 } circle/>
                    <div>
                        <Skeleton width={ 110 }/>
                        <div className="flex flex-wrap gap-2 mb-1 items-center mt-2">
                            <Skeleton width={ 15 } height={ 15 } circle/>
                            <Skeleton width={ 30 } height={ 8 }/>
                        </div>
                    </div>
                </div>
            </div>
            <Skeleton height={ 70 }/>
            <div className="flex flex-wrap justify-between mt-6 mb-1">
                <Skeleton width={25} height={25}/>
                <Skeleton width={100} height={30} style={{borderRadius: "35px"}}/>
            </div>
        </div>
    )
}