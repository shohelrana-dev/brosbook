/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'brosbook-api.onrender.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dueb1rgip/image/upload/*/brosbook/*',
            },
        ],
    },
}

export default nextConfig
