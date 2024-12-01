import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
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
})
