import Link       from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="mt-10 text-5xl text-blue-500">404</h1>
            <h1 className=" mb-4 text-2xl text-gray-800">Page Not Found</h1>
            <Link href="/" className="px-4 py-2 blue button">
                Home
            </Link>
        </div>
    )
}