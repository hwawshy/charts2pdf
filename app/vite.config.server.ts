import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
            include: '**/*.svg',
        }),
    ],
    publicDir: false,
    build: {
        outDir: 'ssr',
        rollupOptions: {
            input: {
                app: "./assets/entrypoint/app-server.tsx",
            },
        },
    },
    server: {
        allowedHosts: ["host.docker.internal"]
    }
})
