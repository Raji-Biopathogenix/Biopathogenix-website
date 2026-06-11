import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['biopathogenix.com', 'localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',  //local or production(https)
        hostname: '127.0.0.1',  //local or production ( 'api.yourdomain.com', )
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },


};

export default nextConfig;
