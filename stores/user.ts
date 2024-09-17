import { defineStore } from 'pinia'
import { Community } from "@/types/communities";
import { Event } from "@/types/events";
import { privileges } from '@/constants/privileges';

const runtimeConfig = useRuntimeConfig();

interface CommunityRole {
    role: string;
    community: string;
}

interface CommunityEvents {
    communityId: string;
    communityEvents: [];
}

export const useUser = defineStore('user', {
    state: () => ({
        userInfo: {},
        userRoles: [],
        communitiesRoles: [] as CommunityRole[],
        userCommunities: [],
        userCommunitiesEvents: {
            communityId: "",
            communityEvents: []
        } as CommunityEvents,
        userCommunitiesChallenges: []
    }),

    getters: {
        getUserInfo: (state) => state.userInfo,

        getUserRoles: (state) => state.userRoles,

        getUserCommunitiesRoles: (state) => state.communitiesRoles,

        getUserCommunities: (state) => state.userCommunities,

        getUserCommunitiesEvents: (state) => state.userCommunitiesEvents,

        getUserCommunitiesChallenges: (state) => state.userCommunitiesChallenges
    },

    actions: {
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },

        setUserRoles(userRoles: string[]) {
            this.userRoles = userRoles;
        },

        setUserCommunitiesRoles(roles: string[] = []) {
            this.communitiesRoles = roles.reduce<CommunityRole[]>((accumulator, rol) => {
                if (!rol) return accumulator;
                const [role, community] = rol.split(":");
                accumulator.push({ role, community });
                return accumulator;
            }, []);
        },

        setUserCommunities(userCommunities) {
            this.userCommunities = userCommunities;
        },

        setUserCommunitiesEvents(userCommunitiesEvents: CommunityEvents) {        
            this.userCommunitiesEvents.communityId = userCommunitiesEvents.communityId;
            this.userCommunitiesEvents.communityEvents = userCommunitiesEvents.communityEvents;
        },

        setUserCommunitiesChallenges(userCommunitiesChallenges) {
            this.userCommunitiesChallenges = userCommunitiesChallenges;
        },

        async fetchUserPrivileges(token) {
            return await fetch(`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}/query/privileges`,
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
                this.setUserCommunitiesRoles(data)
                return data;
            })
            .catch((error) => console.error('Error:', error));
        },

        async fetchCommunities(token) {
            return await fetch(`${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community`,
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
                data = this.formatCommunityData(data);
                data = this.setCommunityPrivileges(data);
                this.setUserCommunities(data);
                return data;
            })
            .catch((error) => console.error('Error:', error));
        },

        async fetchCommunitiesEvents(token: string, community: string) {
            await fetch(
            `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/BenchmarkingEvent`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                method: "GET",
                },
            ).then((response) => response.json())
            .then((data) => {
                data = data.filter((event: any) => event.community_id === community);
                data = this.formatCommunityEventData(data);
                data = this.setCommunityEventPrivileges(data);
                let eventData = {
                    communityId: community,
                    communityEvents: data
                }
                this.setUserCommunitiesEvents(eventData);
                return eventData;
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
                this.setUserCommunitiesChallenges(data)
            });
        },

        formatCommunityData(data) {
            return data.map((community: Community) => {
                return {
                    _id: community._id,
                    name: community.acronym,
                    logo: community.links.filter((link: any) => link.comment === "@logo")[0].uri,
                    links: community.links,
                    status: community.status,
                    community_contact: community.community_contact_ids.map((contact: string) => {
                        return contact.replace(/\./g, " ");
                    }).join(", "),
                    to: `${runtimeConfig.public.BASE_URL}/benchmarking/${community._id}`,
                    privileges: community.privileges,
                    actions: community.actions || [],
                }
            });
        },

        formatCommunityEventData(data) { 
            return data.map((event: Event) => { 
                return {
                    _id: event._id,
                    name: event.name,
                    url: event.url,
                    community_id: event.community_id,
                    bench_contact: event.bench_contact_ids.map((contact: string) => {
                        return contact.replace(/\./g, " ");
                    }).join(", "),
                    dates: event.dates,
                    to: `${runtimeConfig.public.BASE_URL}/benchmarking/${event.community_id}/event/${event._id}`,
                    privileges: event.privileges || "",
                    actions: event.actions || [],
                }
            });
        },

        setCommunityPrivileges(data: Community[]): Community[] {
            let userPrivileges = this.getUserCommunitiesRoles;
            data.forEach((community: Community) => {
                community.actions = [];
                community.privileges = "None";
                if (userPrivileges.length > 0) {
                    userPrivileges.some((value: { role: string; community: string }) => {
                    if (value.role === 'owner' && value.community === community._id) {
                        community.actions = privileges.owner;
                        community.privileges = 'Owner';
                        return true; // Stop iteration
                    } else if (value.role === 'manager' && value.community === community._id) {
                        community.actions = privileges.manager;
                        community.privileges = 'Manager';
                        return true; // Stop iteration
                    } else {
                        community.actions = privileges.anyone;
                        community.privileges = 'anyone';
                        return false; // Continue iteration
                    }
                });
                }
            });
            return data; // Return the modified data array
        },

        setCommunityEventPrivileges(data: Event[]): Event[] {
            let userPrivileges = this.getUserCommunitiesRoles;
            data.forEach((event: Event) => {
                event.actions = [];
                event.privileges = "None";
                if (userPrivileges.length > 0) {
                    userPrivileges.some((value: { role: string; community: string }) => {
                    if (value.role === 'owner' && value.community === event.community_id) {
                        event.actions = privileges.owner;
                        event.privileges = 'Owner';
                        return true; // Stop iteration
                    } else if (value.role === 'manager' && value.community === event.community_id) {
                        event.actions = privileges.manager;
                        event.privileges = 'Manager';
                        return true; // Stop iteration
                    } else {
                        event.actions = privileges.anyone;
                        event.privileges = 'anyone';
                        return false; // Continue iteration
                    }
                });
                }
            });
            return data
        }
    },

});