import type { ProxyOptions } from 'vite'

export function createProxy(env: Record<string, string>): Record<string, string | ProxyOptions> {
    const ret: Record<string, string | ProxyOptions> = {}
    apiProxy(env, ret)
    return ret
}
// /api 代理
function apiProxy(env: Record<string, string>, ret: Record<string, string | ProxyOptions>) {
    let prefix = env.VITE_API_PREFIX
    let target = env.VITE_API_BASE_URL
    let version = env.VITE_DOCKER_REGISTRY_VERSION
    ret[prefix] = {
        target,
        // 允许跨域
        changeOrigin: true,
        // ws: true,
        rewrite: (path) => path.replace(prefix, version)
    }
}
