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
    swcMinify: true,
    experimental: {
        appDir: true,
        fontLoaders: [
            { loader: '@next/font/google', options: { subsets: ['latin'] } },
        ]
    },
    compiler: {
        removeConsole: {
            exclude: ['error'],
        }
    },
}

module.exports = nextConfig
