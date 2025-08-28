import { defineStore } from 'pinia';

export const useMainStore = defineStore('store', {
    state: () => ({
        count: 0,
        name: 'Pangalan',
        userInformation: {},
    }),
    getters: {
    },
    actions: {
    },
    persist: {
        key: 'store',
        paths: ['userInformation'] 
    }
});