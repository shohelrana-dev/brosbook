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
            'res.cloudinary.com'
        ]
    }
}

module.exports = nextConfig
