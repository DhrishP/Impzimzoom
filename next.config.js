/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhosts", "127.0.0.1"],
  },
  transpilePackages: ["crypto-js"],
};

module.exports = nextConfig;
