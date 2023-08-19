import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from './build/vite/plugin'
import { createProxy } from './build/vite/proxy'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const envDir = 'env'
    const env = loadEnv(mode, envDir)

    return {
        envDir: envDir,
        plugins: createVitePlugins(),
        server: {
            proxy: createProxy(env)
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
    }
})
