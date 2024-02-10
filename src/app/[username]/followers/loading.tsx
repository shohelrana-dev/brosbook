import UsersSkeleton from '~/components/skeletons/UsersSkeleton'

export default function Loading() {
   return (
      <div className="card p-3">
         <UsersSkeleton />
      </div>
   )
}
