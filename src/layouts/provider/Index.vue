<template>
    <!-- inline-theme-disabled -->
    <n-config-provider :theme="systemSto.getDarkTheme ? darkTheme : null">
        <n-global-style />
        <!-- 进度加载条 -->
        <n-loading-bar-provider>
            <!-- 全局模态对话框 -->
            <n-dialog-provider>
                <!-- 顶部消息提示框 -->
                <n-message-provider>
                    <!-- 左侧通知窗口 -->
                    <n-notification-provider>
                        <mout-data />
                        <slot></slot>
                    </n-notification-provider>
                </n-message-provider>
            </n-dialog-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
const systemSto = systemStore()
</script>
<style scoped lang="css">
.n-config-provider {
    width: 100%;
    height: 100%;
}
</style>
