import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    server: {
        host: '0.0.0.0'
    },
    plugins: [
        react(),
        symfonyPlugin({
            viteDevServerHostname: 'localhost'
        }),
    ],
    base: '/build/',
    build: {
        outDir: 'public/build',
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                app: "./assets/entrypoint/app-client.tsx"
            },
        }
    },
});
