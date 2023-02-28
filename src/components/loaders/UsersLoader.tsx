import Skeleton from 'react-loading-skeleton'

export default function UsersLoader( { count = 4 } ){
    return (
        <div className="bg-white">
            { Array.from( { length: count } ).map( () => (
                <div className="p-2 mb-1 flex gap-3 w-full">
                    <Skeleton width={ 48 } height={ 48 } circle/>
                    <div>
                        <Skeleton width={ 110 } height={ 12 }/>
                        <Skeleton width={ 80 } height={ 7 }/>
                        <div className="mb-[5px]"/>
                        <Skeleton width={200} height={ 9 }/>
                    </div>
                </div>
            ) ) }
        </div>
    )
}