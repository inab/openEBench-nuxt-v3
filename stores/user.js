import { defineStore } from 'pinia'

export const useUser = defineStore('user', {
    state: () => ({
        userInfo: {},
        userRoles: [],
        communitiesRoles: [],
        userCommunities: [],
        userCommunitiesEvents: [],
        userCommunitiesChallenges: []
    }),

    getters: {
        getUserInfo: (state) => state.userInfo,

        getUserRoles: (state) => state.userRoles,

        getUserCommunitiesRoles: (state) => state.userInfo.communitiesRoles,

        getUserCommunities: (state) => state.userCommunities,

        getUserCommunitiesEvents: (state) => state.userCommunitiesEvents,

        getUserCommunitiesChallenges: (state) => state.userCommunitiesChallenges
    },

    actions: {
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },

        setUserRoles(userRoles) {
            this.userRoles = userRoles;
        },

        setUserCommunitiesRoles(communitiesRoles) {
            this.communitiesRoles = communitiesRoles;
        },

        setUserCommunities(userCommunities) {
            this.userCommunities = userCommunities;
        },

        setUserCommunitiesEvents(userCommunitiesEvents) {
            this.userCommunitiesEvents = userCommunitiesEvents;
        },

        setUserCommunitiesChallenges(userCommunitiesChallenges) {
            this.userCommunitiesChallenges = userCommunitiesChallenges;
        },

        async fetchCommunities(token) {
            console.log(token)
            return await fetch("https://dev-openebench.bsc.es/api/scientific/staged/Community",
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "GET",
                },
            )
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data)
                this.setUserCommunities(data)
                return data;
            })
            .catch((error) => console.error('Error:', error));
        },

        async fetchCommunitiesEvents(token) {
            await fetch(
            "https://dev-openebench.bsc.es/api/scientific/staged/Community",
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "GET",
                },
            ).then((response) => response.json())
            .then((data) => {
                console.log("data: ", data)
                this.setUserCommunitiesEvents(data)
            });
        },

        async fetchCommunitiesChallenge(token) {
            await fetch(
            "https://dev-openebench.bsc.es/api/scientific/staged/Community",
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "GET",
                },
            ).then((response) => response.json())
            .then((data) => {
                console.log("data: ", data)
                this.setUserCommunitiesChallenges(data)
            });
        },
    }

});