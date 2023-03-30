/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: false,
    images: {
        domains: [
            'localhost',
            'brosbook-api.onrender.com',
            'res.cloudinary.com'
        ]
    },
    experimental: {
        appDir: true
    }
}

module.exports = nextConfig
