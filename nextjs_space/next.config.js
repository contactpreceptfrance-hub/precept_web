const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
    // Cover uploads from /admin/livres travel through a Server Action, whose
    // body defaults to 1 MB. Two 2 MB covers plus the text fields fit in 5 MB;
    // Vercel itself stops a request at 4.5 MB, which is what the per-image cap
    // in lib/book-images.ts is sized against.
    serverActions: { bodySizeLimit: '5mb' },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Every cover is a local asset in public/images/books (84 files, 5.8 MB at
    // 681x1024). Cards request them at sizes="176px", so letting Next resize and
    // negotiate the format is the difference between a ~70 KB source file and a
    // thumbnail an order of magnitude smaller.
    formats: ['image/avif', 'image/webp'],
    // Covers uploaded from the admin live in Vercel Blob.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
};

module.exports = nextConfig;
