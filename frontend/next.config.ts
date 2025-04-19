import { is_git } from './cfg';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = is_git
  ? {
      output: 'export',
      basePath: '/pet-media-manager',
      trailingSlash: true,
      // assetPrefix: '/pet-media-manager/',
    }
  : {};

module.exports = nextConfig;
