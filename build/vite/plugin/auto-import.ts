import AutoImport from 'unplugin-auto-import/vite'
import type { ImportsMap } from 'unplugin-auto-import/types'
/**
 * 自动导入Api
 * 参考 https://github.com/unjs/unimport/blob/main/src/presets/
 */
export function createAutoImportPlugin() {
    return AutoImport({
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/api','src/stores'],
        imports: ['vue', 'vue-router', 'pinia', funImport]
    })
}

// 导入指定方法
const funImport: ImportsMap = {
    'naive-ui': ['useThemeVars', 'useMessage', 'useDialog', 'useLoadingBar', 'useNotification']
}
