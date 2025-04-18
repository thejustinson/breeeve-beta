/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['cdn.discordapp.com', 'i.imgur.com', 'imgur.com', 'media.discordapp.net'],
  },
}

module.exports = nextConfig
