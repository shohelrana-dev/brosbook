/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'brosbook-api.onrender.com'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            },
        ]
    }
}

module.exports = nextConfig
