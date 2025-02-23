import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        sourcemap: false,
    },
    server: {
        hmr: {
            timeout: 30000,
            overlay: true,
        },
    },
    optimizeDeps: {
        include: ['@mantine/core'],
    },
});
