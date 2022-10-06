/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'localhost',
            'lh3.googleusercontent.com'
        ]
    },
    swcMinify: true
}

module.exports = nextConfig
