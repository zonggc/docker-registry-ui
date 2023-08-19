import { http } from '@/network'
import type { Manifests, ManifestsV2, Repositories, TagsList } from '@/types'

export function catalog() {
    return http.get<Repositories>('_catalog')
}

export function tagsList(name: string) {
    return http.get<TagsList>(`${name}/tags/list`)
}

export function manifests(name: string, tag: string) {
    return http.get<Manifests>(`${name}/manifests/${tag}`, {
        headers: {
            Accept: 'application/vnd.docker.distribution.manifest.v1+json'
        }
    })
}

export function manifestsV2(name: string, tag: string) {
    return http.get<ManifestsV2>(`${name}/manifests/${tag}`, {
        headers: {
            Accept: 'application/vnd.docker.distribution.manifest.v2+json'
        }
    })
}

export function deleteImageByTag(name: string, digest: string) {
    return http.delete(`${name}/manifests/${digest}`)
}
