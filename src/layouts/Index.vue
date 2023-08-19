<script lang="ts" setup>
import Navigation from '@/layouts/navigation/Index.vue'
import MainContent from '@/layouts/content/Index.vue'
import { useElementSize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import type { CSSProperties } from 'vue'
const currentRoute = useRoute()

const navigationRef = ref<HTMLElement | null>(null)
const { height: headerHeight } = useElementSize(navigationRef)

const contentStyleRef = ref<CSSProperties>({
    padding: '10px'
})

onMounted(() => {
    if (!currentRoute.meta || currentRoute.meta?.layout) {
        contentStyleRef.value.height = '100%'
    }
})
</script>
<template>
    <n-layout
        embedded
        style="
             {
                width: 100%;
                height: 100%;
            }
        ">
        <n-layout-header bordered ref="navigationRef">
            <Navigation />
        </n-layout-header>
        <n-layout-content
            embedded
            :native-scrollbar="false"
            :style="{
                width: '100%',
                height: `calc(100% - ${headerHeight + 1}px)`
            }"
            :content-style="contentStyleRef">
            <!-- content-style 添加绝对布局, height: '100%'  -->
            <main-content id="appMain" style="height: 100%" />
        </n-layout-content>
    </n-layout>
</template>
<style scoped></style>
