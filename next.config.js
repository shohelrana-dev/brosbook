/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: false,
    swcMinify: false,
    images: {
        domains: [
            'localhost',
            'brosbook-api.up.railway.app',
            'lh3.googleusercontent.com'
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
