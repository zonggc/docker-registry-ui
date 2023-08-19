import ViteComponents from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
/**
 * 按需自动 自动导入 组件
 * 运行时自动生成追加
 * @returns
 */
export function createComponentsPlugin() {
    return ViteComponents({
        dts: 'src/types/components.d.ts',
        // 指定组件位置，默认是src/components
        // dirs: ['@/components'],
        // // 只扫描 dirs 根目录下的
        // // extensions: ['vue','ts','tsx'],
        // extensions: ['vue', 'tsx'],
        // deep: false,

        // 全局模式下匹配的组件
        // 指定时，将忽略“dirs”和“extensions”选项。
        globs: [],
        include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/],
        // auto import Icon & Naive compontents
        resolvers: [NaiveUiResolver()]
    })
}
