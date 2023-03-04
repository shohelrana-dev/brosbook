import Skeleton from 'react-loading-skeleton'

export default function UsersLoader( { count = 4 } ){
    return (
        <div className="bg-white">
            { Array.from( { length: count } ).map( () => (
                <div className="flex gap-2 w-full mb-3">
                    <Skeleton width={ 45 } height={ 45 } circle/>
                    <div>
                        <Skeleton width={ 110 } height={ 10 }/>
                        <Skeleton width={ 80 } height={ 6 }/>
                        <div className="mb-[3px]"/>
                        <Skeleton width={200} height={ 8 }/>
                    </div>
                </div>
            ) ) }
        </div>
    )
}