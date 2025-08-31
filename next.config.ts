/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/firewall/:path*", destination: "http://localhost:3000/api/firewall/:path*" },
    ];
  },
};

export default nextConfig;
