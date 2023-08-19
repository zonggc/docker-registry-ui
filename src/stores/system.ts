import { defineStore } from 'pinia'

interface SystemStore {
    darkTheme: boolean
}

export const systemStore = defineStore('system', {
    state: (): SystemStore => ({
        darkTheme: true
    }),
    actions: {
        switchTheme(dark: boolean) {
            this.darkTheme = dark
        }
    },
    getters: {
        getDarkTheme(): boolean {
            return this.darkTheme
        }
    }
})
