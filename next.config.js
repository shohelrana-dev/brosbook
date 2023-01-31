/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'localhost',
            'brosbook-api.up.railway.app',
            'res.cloudinary.com'
        ]
    },
    experimental: {
        appDir: true,
        fontLoaders: [
            { loader: '@next/font/google', options: { subsets: ['latin'] } },
        ]
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: false
    }
}

module.exports = nextConfig
