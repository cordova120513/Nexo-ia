import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desactivar compresión y optimización de imágenes para máxima fidelidad visual y resolución original
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
