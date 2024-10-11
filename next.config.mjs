/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  },
};

export default nextConfig;
