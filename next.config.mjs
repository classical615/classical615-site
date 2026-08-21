/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@sparticuz/chromium/**/*'],
  },
};

export default nextConfig;