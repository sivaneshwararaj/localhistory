// types/next-pwa.d.ts
declare module 'next-pwa' {
    import { NextConfig } from 'next';

    interface PWAConfig {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        // Add any other next-pwa options you use here
    }

    function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

    export = withPWA;
  }