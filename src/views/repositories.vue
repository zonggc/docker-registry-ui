<script setup lang="ts">
import { NButton, NIcon, type TreeOption } from 'naive-ui'
// @ts-ignore
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import { useClipboard } from '@vueuse/core'

import type { Manifests, ManifestsV2 } from '@/types'

type TreeOptionDepth = TreeOption & { depth: number; reload?: boolean; parentKey: string }

const message = useMessage()
const userTheme = useThemeVars()

const { text, isSupported, copy } = useClipboard()

const dataReactive = reactive<{
    dockerApiVersion?: string
    repositories: TreeOptionDepth[]
    manifests?: Manifests
    manifestsV2?: ManifestsV2
    contentDigest?: string
}>({
    dockerApiVersion: '',
    repositories: [],
    manifests: undefined,
    manifestsV2: undefined
})

const copyDigest = (digest?: string) => {
    if (!digest) {
        return
    }
    if (isSupported) {
        copy(digest)
            .then(() => message.success('复制成功'))
            .catch(() => message.error(`${text.value}复制失败`))
    } else {
        message.warning('您的浏览器不支持剪贴板')
    }
}
const manifestsClear = () => {
    dataReactive.manifests = undefined
    dataReactive.manifestsV2 = undefined
    dataReactive.contentDigest = undefined
}

const getManifests = (name: string, version: string) => {
    manifestsClear()
    manifests(name, version)
        .then((res) => {
            dataReactive.manifests = res.data
            manifestsV2(name, version)
                .then((res) => {
                    dataReactive.contentDigest = res.headers['docker-content-digest']
                    dataReactive.manifestsV2 = res.data
                })
                .catch((error) => {
                    console.error(error)
                })
        })
        .catch((error) => {
            console.error(error)
            message.error(`${name}:${version}获取失败`)
        })
}

const headleCatalog = (tip: boolean = false) => {
    dataReactive.repositories = []
    catalog()
        .then((res) => {
            const version: string = res.headers['docker-distribution-api-version']
            dataReactive.dockerApiVersion = version && version.split('/')[1]
            dataReactive.repositories = res.data.repositories.map<TreeOptionDepth>((repositorie) => {
                return { key: repositorie, label: repositorie, isLeaf: false, depth: 0, parentKey: '' }
            })
            tip && message.success('刷新成功')
        })
        .catch((error) => {
            console.error(error)
            message.error('库获取失败')
        })
}
const handDeleteImageBy = (name?: string, digest?: string, tag?: string) => {
    if (name && digest) {
        deleteImageByTag(name, digest)
            .then((res) => {
                message.success(`${name}:${tag}删除成功`)
            })
            .catch((error) => {
                message.error(`${name}:${tag}删除失败`)
                console.error('删除失败', error)
            })
    } else {
        message.success('参数为空')
    }

    console.log(name, digest)
}

const headleRefreshCatalog = () => {
    headleCatalog(true)
}

const handleLoad = async (option: TreeOption): Promise<unknown> => {
    manifestsClear()
    const key = option.key as string
    try {
        const res = await tagsList(key)
        if (!res.data.tags) {
            option.children = []
        } else {
            option.children = res.data.tags.map<TreeOptionDepth>((tag) => {
                return { key: `${key}:${tag}`, label: tag, parentKey: key, isLeaf: true, depth: 1 }
            })
        }
    } catch (e) {
        message.success(`${key} 刷新失败`)
        return await Promise.reject(e)
    }
}

const expandedKeys = (
    keys: Array<string | number>,
    option: Array<TreeOption | null>,
    meta: { node: TreeOption | null; action: 'expand' | 'collapse' | 'filter' }
) => {
    if (meta.node && meta.action === 'expand') {
        meta.node.reload === true
        // 去除子节点，重新触发异步加载
        meta.node.children = undefined
    }
}

const nodeProps = ({ option }: { option: TreeOption }) => {
    const { depth, parentKey, label } = option
    if (depth === 1) {
        return {
            onClick: () => parentKey && typeof parentKey === 'string' && label && getManifests(parentKey, label)
        }
    } else {
        return {}
    }
}
onMounted(async () => {
    headleCatalog(false)
})
</script>
<template>
    <n-grid x-gap="10" :cols="5">
        <n-gi :span="1">
            <n-card
                style="height: 100%"
                size="small"
                :segmented="{
                    content: true
                }">
                <template #header>
                    <n-text code round>{{ dataReactive.dockerApiVersion }}</n-text>
                </template>
                <template #header-extra>
                    <n-button text @click="headleRefreshCatalog">刷新</n-button>
                </template>
                <n-empty v-if="dataReactive.repositories.length <= 0" description="你什么也找不到">
                    <template #extra>看看别的</template>
                </n-empty>
                <n-tree
                    v-else
                    block-line
                    expand-on-click
                    :data="dataReactive.repositories"
                    :on-load="handleLoad"
                    virtual-scroll
                    :style="{ maxHeight: '80%' }"
                    @update:expanded-keys="expandedKeys"
                    :node-props="nodeProps"
                    style="user-select: none; -webkit-user-select: none" />
            </n-card>
        </n-gi>
        <n-gi :span="4">
            <n-card v-if="!dataReactive.manifests">
                <n-empty description="你什么也找不到">
                    <template #extra>看看别的</template>
                </n-empty>
            </n-card>

            <n-card
                v-else
                size="small"
                :segmented="{
                    content: true
                }">
                <template #header>
                    <n-space :size="100">
                        <n-text>
                            名称:&nbsp;&nbsp;
                            <n-text code round>{{ dataReactive.manifests.name }}</n-text>
                        </n-text>
                        <n-text>
                            标签:&nbsp;&nbsp;
                            <n-text code round>{{ dataReactive.manifests.tag }}</n-text>
                        </n-text>
                        <n-text>
                            架构:&nbsp;&nbsp;
                            <n-text code round>{{ dataReactive.manifests.architecture }}</n-text>
                        </n-text>
                        <n-text>
                            架构版本:&nbsp;&nbsp;
                            <n-text code round>{{ dataReactive.manifests.schemaVersion }}</n-text>
                        </n-text>
                        <n-text>
                            摘要:&nbsp;&nbsp;
                            <!-- <n-text code round>{{ dataReactive.contentDigest }}</n-text> -->
                            <n-button size="tiny" secondary strong @click="copyDigest(dataReactive.contentDigest)">
                                {{ dataReactive.contentDigest }}
                            </n-button>
                        </n-text>
                    </n-space>
                </template>
                <template #header-extra>
                    <n-button
                        disabled
                        size="tiny"
                        type="primary"
                        @click="handDeleteImageBy(dataReactive.manifests.name, dataReactive.contentDigest, dataReactive.manifests.tag)">
                        删除
                    </n-button>
                </template>
                <n-collapse id="json-view-container" accordion display-directive="show">
                    <n-collapse-item title="层描述列表-摘要" name="1">
                        <n-scrollbar style="max-height: 500px" trigger="none">
                            <json-viewer boxed copyable expanded :expand-depth="5" :value="dataReactive.manifests.fsLayers"></json-viewer>
                        </n-scrollbar>
                    </n-collapse-item>
                    <n-collapse-item title="历史" name="2">
                        <n-scrollbar style="max-height: 500px" trigger="none">
                            <json-viewer
                                boxed
                                copyable
                                expanded
                                :expand-depth="5"
                                :value="dataReactive.manifests.history.map((h) => JSON.parse(h.v1Compatibility))"></json-viewer>
                        </n-scrollbar>
                    </n-collapse-item>
                    <n-collapse-item title="签名" name="3">
                        <n-scrollbar style="max-height: 500px" trigger="none">
                            <json-viewer id="" boxed copyable expanded :expand-depth="5" :value="dataReactive.manifests.signatures"></json-viewer>
                        </n-scrollbar>
                    </n-collapse-item>
                </n-collapse>
            </n-card>
        </n-gi>
    </n-grid>
</template>
<style lang="scss" scoped>
// :deep(#json-view-container) {}
:deep(.jv-container) {
    box-sizing: border-box;
    position: relative;

    &.boxed {
        border: 1px solid #eee;
        border-color: v-bind('userTheme.borderColor');
        border-radius: v-bind('userTheme.borderRadius');

        &:hover {
            box-shadow: 0 2px 7px rgba(0, 0, 0, 0.15);
            border-color: transparent;
            position: relative;
        }
    }

    &.jv-light {
        background: v-bind('userTheme.codeColor');
        white-space: nowrap;
        color: v-bind('userTheme.textColor2');
        font-size: v-bind('userTheme.fontSize');
        font-family: v-bind('userTheme.fontFamily');

        .jv-ellipsis {
            color: v-bind('userTheme.textColor1');
            background-color: v-bind('userTheme.avatarColor');
            display: inline-block;
            line-height: 0.9;
            font-size: 0.9em;
            padding: 0px 4px 2px 4px;
            margin: 0 4px;
            border-radius: 3px;
            vertical-align: 2px;
            cursor: pointer;
            user-select: none;
        }
        .jv-button {
            color: v-bind('userTheme.primaryColor');
        }
        .jv-key {
            color: v-bind('userTheme.textColor2');
            margin-right: 4px;
        }
        .jv-item {
            &.jv-array {
                color: v-bind('userTheme.textColor2');
            }
            &.jv-boolean {
                color: v-bind('userTheme.errorColor');
            }
            &.jv-function {
                color: v-bind('userTheme.infoColor');
            }
            &.jv-number {
                color: v-bind('userTheme.errorColor');
            }
            &.jv-object {
                color: v-bind('userTheme.textColor2');
            }
            &.jv-undefined {
                color: v-bind('userTheme.warningColor');
            }
            &.jv-string {
                color: v-bind('userTheme.primaryColor');
                word-break: break-word;
                white-space: normal;

                .jv-link {
                    color: v-bind('userTheme.infoColorSuppl');
                }
            }
        }
        .jv-code {
            .jv-toggle {
                &:before {
                    padding: 0px 2px;
                    border-radius: 2px;
                }
                &:hover {
                    &:before {
                        background: v-bind('userTheme.codeColor');
                    }
                }
            }
        }
    }

    .jv-code {
        overflow: hidden;
        padding: 30px 20px;

        &.boxed {
            max-height: 300px;
        }

        &.open {
            max-height: initial !important;
            overflow: visible;
            overflow-x: auto;
            padding-bottom: 45px;
        }
    }

    .jv-toggle {
        // background-image: url(./icon.svg);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
        cursor: pointer;
        width: 10px;
        height: 10px;
        margin-right: 2px;
        display: inline-block;
        transition: transform 0.1s;

        &.open {
            transform: rotate(90deg);
        }
    }

    .jv-more {
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        width: 100%;
        text-align: center;
        cursor: pointer;

        .jv-toggle {
            position: relative;
            top: 40%;
            z-index: 2;
            color: v-bind('userTheme.primaryColor');
            transition: all 0.1s;
            transform: rotate(90deg);

            &.open {
                transform: rotate(-90deg);
            }
        }

        &:after {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, v-bind('userTheme.closeColorPressed') 100%);
            transition: all 0.1s;
        }

        &:hover {
            .jv-toggle {
                top: 50%;
                color: #111;
            }

            &:after {
                background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, v-bind('userTheme.closeColorHover') 100%);
            }
        }
    }

    .jv-button {
        position: relative;
        cursor: pointer;
        display: inline-block;
        padding: 5px;
        z-index: 5;

        &.copied {
            opacity: 0.4;
            cursor: default;
        }
    }

    .jv-tooltip {
        position: absolute;

        &.right {
            right: 15px;
        }
        &.left {
            left: 15px;
        }
    }

    .j-icon {
        font-size: 12px;
    }
}
</style>
