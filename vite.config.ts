import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
    plugins: [
        react(),
        Sitemap({
            hostname: 'https://zameengar.com',
            dynamicRoutes: ['/about', '/advertise', '/contact', '/privacy', '/properties', '/terms']
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
