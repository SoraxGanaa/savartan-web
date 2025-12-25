/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://47.129.131.88:3001/:path*",
      },
    ];
  },
};

export default nextConfig;
