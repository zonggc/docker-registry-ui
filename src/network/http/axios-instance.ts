import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX, //接口统一域名
    timeout: 60000, //设置超时
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Registry-Version': import.meta.env.VITE_DOCKER_REGISTRY_VERSION
    }
})

export default instance
