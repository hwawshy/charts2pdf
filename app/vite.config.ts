import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    server: {
        host: '0.0.0.0',
        allowedHosts: ["local.charts2pdf.com"],
        cors: {
            origin: true // TODO fix chromium not setting origin header
        }
    },
    plugins: [
        react(),
        symfonyPlugin({
            viteDevServerHostname: 'local.charts2pdf.com'
        }),
        svgr({
            svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
            include: '**/*.svg',
        }),
    ],
    base: '/build/',
    build: {
        outDir: 'public/build',
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                app: "./assets/entrypoint/app-client.tsx",
                pdf: "./assets/entrypoint/pdf-client.ts"
            },
        }
    },
});
