import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * Hosts that uploads may be served from: the object storage endpoint, plus a
 * CDN/custom domain if one is configured. Only needed for next/image; the site
 * renders pre-resized variants with plain <img>, which never touches the
 * optimizer.
 */
const assetHosts = [process.env.S3_PUBLIC_URL, process.env.S3_ENDPOINT]
  .filter(Boolean)
  .map((value) => {
    try {
      const { hostname, protocol } = new URL(value)
      return { protocol: protocol.replace(':', ''), hostname }
    } catch {
      return null
    }
  })
  .filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // SVG only ever reaches the browser from the `brand` collection, which is
    // admin-only and served from the storage origin rather than the app origin.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/api/brand/file/**',
      },
      {
        pathname: '/api/people/file/**',
      },
    ],
    remotePatterns: assetHosts,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
