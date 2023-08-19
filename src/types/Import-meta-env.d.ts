interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_API_PREFIX: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_DOCKER_REGISTRY_VERSION: string
}
