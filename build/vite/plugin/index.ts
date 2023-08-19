import type { PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { createAutoImportPlugin } from './auto-import'
import { createComponentsPlugin } from './components'

export function createVitePlugins(): PluginOption[] {
    return [
        // 和 tab-view 组件中的  VResizeObserver 冲突
        // VueDevTools(),
        vue(),
        vueJsx(),
        createAutoImportPlugin(),
        createComponentsPlugin()
    ]
}
