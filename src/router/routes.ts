import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/layouts/Index.vue'),
        children: [
            {
                path: '',
                name: 'repositories',
                component: () => import('@/views/repositories.vue'),
                meta: {
                    layout: true
                }
            }
        ]
    },
    {
        name: '404',
        path: '/:catchAll(.*)',
        component: () => import('@/layouts/result/404.vue')
    }
]
