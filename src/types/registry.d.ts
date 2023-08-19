export interface Repositories {
    repositories: string[]
}

export interface TagsList {
    name: string
    tags: string[]
}

export interface Manifests {
    schemaVersion: string
    name: string
    tag: string
    architecture: string
    fsLayers: FSLayer[]
    history: History[]
    signatures: Signature[]
}

export interface FSLayer {
    blobSum: string
}

export interface History {
    v1Compatibility: string
}

export interface Signature {
    header: Header
    signature: string
    protected: string
}

export interface Header {
    jwk: Jwk
    alg: string
}

export interface Jwk {
    crv: string
    kid: string
    kty: string
    x: string
    y: string
}

export interface ManifestsV2 {
    schemaVersion: number
    mediaType: string
    config: Config
    layers: Config[]
}

export interface Config {
    mediaType: string
    size: number
    digest: string
}
