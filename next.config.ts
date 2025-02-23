/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          tls: false,
        },
      }
    }
    config.module!.rules.push({
      test: /\.worker\.ts$/,
      loader: 'worker-loader',
      options: {
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    })
    return config
  },
}

export default nextConfig
