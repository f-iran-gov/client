/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["https://purecatamphetamine.github.io"],
  },
}

module.exports = nextConfig
