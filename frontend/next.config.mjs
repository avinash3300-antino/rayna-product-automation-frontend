/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.getyourguide.com",
      },
      {
        protocol: "https",
        hostname: "cdn-imgix.headout.com",
      },
      {
        protocol: "https",
        hostname: "**.viator.com",
      },
      {
        protocol: "https",
        hostname: "**.egypttoursportal.com",
      },
      {
        protocol: "https",
        hostname: "**.tacdn.com",
      },
    ],
  },
};

export default nextConfig;
