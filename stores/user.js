import { defineStore } from 'pinia'

export const useUser = defineStore('user', {
    state: () => ({
        userInfo: {},
        userRoles: []
    }),

    getters: {
        getUserInfo: (state) => state.userInfo,

        getUserRoles: (state) => state.userRoles
    },

    actions: {
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },

        setUserRoles(userRoles) {
            this.userRoles = userRoles;
        }
    }

});