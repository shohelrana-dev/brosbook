/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: false,
    swcMinify: false,
    images: {
        domains: [
            'localhost',
            'brosbook-api.onrender.com',
            'brosbook-api.adaptable.app',
            'res.cloudinary.com'
        ]
    }
}

module.exports = nextConfig
