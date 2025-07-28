import type { NextConfig } from "next";
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public', // Destination directory for the service worker files
  register: true, // Register the service worker
  skipWaiting: true, // Install new service worker without waiting
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
