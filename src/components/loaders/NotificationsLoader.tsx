import Skeleton from 'react-loading-skeleton'

export default function NotificationsLoader( { count = 5 } ){
    return (
        <>
            { Array.from( { length: count } ).map( () => (
                <div className="px-3 py-2 mb-3 flex gap-3 items-center">
                    <Skeleton width={ 45 } height={ 45 } circle/>
                    <div>
                        <div className="flex gap-3 mb-1 items-center">
                            <Skeleton width={ 110 } height={ 12 }/>
                            <Skeleton height={ 8 } width={ 45 }/>
                        </div>
                        <div className="flex gap-3 mb-1 items-center">
                            <Skeleton width={ 80 } height={ 9 }/>
                            <Skeleton width={ 30 } height={ 6 }/>
                        </div>
                    </div>
                </div>
            ) ) }
        </>
    )
}