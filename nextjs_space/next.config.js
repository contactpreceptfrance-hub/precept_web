const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
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
  },
};

module.exports = nextConfig;
