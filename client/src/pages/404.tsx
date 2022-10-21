import Link       from 'next/link'
import MainLayout from "@components/layouts/MainLayout";

export default function NotFound() {
    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="mt-10 text-5xl text-blue-500">404</h1>
                <h1 className=" mb-4 text-2xl text-gray-800">Page Not Found</h1>
                <Link href="/">
                    <a className="px-4 py-2 blue button">Home</a>
                </Link>
            </div>
        </MainLayout>
    )
}