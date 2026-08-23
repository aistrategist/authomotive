/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react', '@paper-design/shaders-react'],
  },
}

export default nextConfig
