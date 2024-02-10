/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
   swcMinify: true,
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

module.exports = nextConfig
