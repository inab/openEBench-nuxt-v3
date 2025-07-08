import { defineStore } from "pinia";
import type { Community } from "@/types/communities";
import type { Event } from "@/types/events";
import type { Challenge } from "@/types/challenges";
import { privileges } from "@/constants/privileges";
import parseDataURL from "data-urls";
import { labelToName, decode } from "whatwg-encoding";

const runtimeConfig = useRuntimeConfig();

interface CommunityRole {
  role: string;
  community: string;
}

interface CommunityEvents {
  communityId: string;
  communityEvents: [];
}

export const useUser = defineStore("user", {
  state: () => ({
    userInfo: {} as object,
    userRoles: [] as string[],
    communitiesRoles: [] as CommunityRole[],
    userCommunities: [],
    userCommunitiesEvents: {
      communityId: "",
      communityEvents: [],
    } as CommunityEvents,
    userCommunitiesChallenges: [],
    contactsList: [],
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,

    getUserRoles: (state) => state.userRoles,

    getUserCommunitiesRoles: (state) => state.communitiesRoles || [],

    getUserCommunities: (state) => state.userCommunities,

    getUserCommunitiesEvents: (state) => state.userCommunitiesEvents,

    getUserCommunitiesChallenges: (state) => state.userCommunitiesChallenges,

    getContactsList: (state) => state.contactsList,
  },

  actions: {
    setUserInfo(userInfo: object) {
      this.userInfo = userInfo;
    },

    setUserRoles(userRoles: string[]) {
      this.userRoles = userRoles;
    },

    setUserCommunitiesRoles(roles: string[] = []) {
      this.communitiesRoles = roles.reduce<CommunityRole[]>(
        (accumulator, rol) => {
          if (!rol) return accumulator;
          const [role, community] = rol.split(":");
          accumulator.push({ role, community });
          return accumulator;
        },
        [],
      );
    },

    setUserCommunities(userCommunities) {
      this.userCommunities = userCommunities;
    },

    setUserCommunitiesEvents(userCommunitiesEvents: CommunityEvents) {
      this.userCommunitiesEvents.communityId =
        userCommunitiesEvents.communityId;
      this.userCommunitiesEvents.communityEvents =
        userCommunitiesEvents.communityEvents;
    },

    setUserCommunitiesChallenges(userCommunitiesChallenges) {
      this.userCommunitiesChallenges = userCommunitiesChallenges;
    },

    async fetchUserPrivileges(token: string) {
      return await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}query/privileges`,
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
          this.setUserCommunitiesRoles(data);
          return data;
        })
        .catch((error) => console.error("Error:", error));
    },

    async fetchCommunities(token: string) {
      return await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Community`,
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
        .catch((error) => console.error("Error:", error));
    },

    async fetchContacts(token: string) {
      const response = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Contact`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      console.log("data: " , data)

      if (!data) {
        [];
      }
      return data.map((d: any) => ({
        id: d._id,
        name: d.givenName + " " + d.surname,
      }));
    },

    async fetchCommunitiesEvents(token: string, community: string) {
      const response = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/BenchmarkingEvent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          method: "GET",
        },
      );

      let data = await response.json();
      if (!data) {
        return [];
      }
      data = data.filter((event: any) => event.community_id === community);
      data = this.formatCommunityEventData(data);
      data = this.setCommunityEventPrivileges(data);
      const eventData = {
        communityId: community,
        communityEvents: data,
      };
      this.setUserCommunitiesEvents(eventData);
      return eventData.communityEvents;
    },

    async fetchCommunitiesEventsChallenges(token: string, event: string) {
      const response = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Challenge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          method: "GET",
        },
      );

      let data = await response.json();
      data = data.filter(
        (challenge: any) => challenge.benchmarking_event_id === event,
      );
      data = this.formatCommunityChallengeData(data);
      data = this.setCommunityChallengePrivileges(data);
      const eventData = {
        communityId: community,
        communityEvents: data,
      };
      this.setUserCommunitiesEvents(eventData);
      return eventData.communityEvents;
    },

    async fetchCommunitiesChallenge(token: string, event: string) {
      const response = await fetch(
        `${runtimeConfig.public.SCIENTIFIC_SERVICE_URL_API}staged/Challenge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          method: "GET",
        },
      );

      let data = await response.json();
      data = data.filter(
        (challenge: any) => challenge.benchmarking_event_id === event,
      );
      data = this.formatCommunityChallengeData(data);
      data = this.setCommunityChallengePrivileges(data);
      const challengeData = {
        eventId: event,
        eventChallenges: data,
      };
      return challengeData.eventChallenges;
    },

    formatCommunityData(data) {
      return data.map((community: Community) => {
        const links = community.links ?? [];
        const logo =
          Array.isArray(links) && links.length > 0
            ? links.find(
                (link: any) =>
                  link.comment === "@logo" || link.label === "Logo",
              )?.uri ||
              "https://raw.githubusercontent.com/inab/openEBench-nuxt/refs/heads/master/static/OEB-minimal-logo-blue.svg"
            : "https://raw.githubusercontent.com/inab/openEBench-nuxt/refs/heads/master/static/OEB-minimal-logo-blue.svg";
        return {
          _id: community._id,
          name: community.acronym,
          logo: logo,
          links: links,
          status: community.status,
          community_contact: community.community_contact_ids
            .map((contact: string) => {
              return {
                id: contact.replace(/\./g, " ").split(":")[1],
                name: contact.replace(/\./g, " ")
              }
            }),
          _metadata: community._metadata ? community._metadata : "",
          to: `${runtimeConfig.public.BASE_URL}/benchmarking/${community._id}`,
          privileges: community.privileges,
          actions: community.actions || [],
        };
      });
    },

    formatCommunityEventData(data) {
      return data.map((event: Event) => {
        return {
          _id: event._id,
          name: event.name,
          url: event.url,
          community_id: event.community_id,
          bench_contact: event.bench_contact_ids
            .map((contact: string) => {
              return contact.replace(/\./g, " ");
            })
            .join(", "),
          dates: event.dates,
          to: `${runtimeConfig.public.BASE_URL}/benchmarking/${event.community_id}/event/${event._id}`,
          privileges: event.privileges || "",
          actions: event.actions || [],
        };
      });
    },

    formatCommunityChallengeData(data) {
      return data.map((challenge: Challenge) => {
        return {
          _id: challenge._id,
          name: challenge.name,
          acronym: challenge.acronym,
          _schema: challenge._schema,
          benchmarking_event_id: challenge.benchmarking_event_id,
          challenge_contact: challenge.challenge_contact_ids
            .map((contact: string) => {
              return contact.replace(/\./g, " ");
            })
            .join(", "),
          dates: challenge.dates,
          references: challenge.references,
          metrics_categories: challenge.metrics_categories,
          url: challenge.url,
          orig_id: challenge.orig_id,
          privileges: challenge.privileges || "",
          actions: challenge.actions || [],
        };
      });
    },

    setCommunityPrivileges(data: Community[]): Community[] {
      const userPrivileges = this.getUserCommunitiesRoles;
      data.forEach((community: Community) => {
        community.actions = [];
        community.privileges = "None";
        if (userPrivileges.length > 0) {
          userPrivileges.some((value: { role: string; community: string }) => {
            if (value.role === "owner" && value.community === community._id) {
              community.actions = privileges.owner;
              community.privileges = "Owner";
              return true;
            } else if (
              value.role === "manager" &&
              value.community === community._id
            ) {
              community.actions = privileges.manager;
              community.privileges = "Manager";
              return true;
            } else {
              community.actions = privileges.anyone;
              community.privileges = "anyone";
              return false;
            }
          });
        }
      });
      return data; // Return the modified data array
    },

    setCommunityEventPrivileges(data: Event[]): Event[] {
      const userPrivileges = this.getUserCommunitiesRoles;
      data.forEach((event: Event) => {
        event.actions = [];
        event.privileges = "None";
        if (userPrivileges.length > 0) {
          userPrivileges.some((value: { role: string; community: string }) => {
            if (value.role === "admin") {
              event.actions = privileges.owner;
              event.privileges = "Owner";
              return true;
            } else if (
              value.role === "owner" &&
              value.community === event.community_id
            ) {
              event.actions = privileges.owner;
              event.privileges = "Owner";
              return true;
            } else if (
              value.role === "manager" &&
              value.community === event.community_id
            ) {
              event.actions = privileges.manager;
              event.privileges = "Manager";
              return true;
            } else {
              event.actions = privileges.anyone;
              event.privileges = "anyone";
              return false;
            }
          });
        }
      });
      return data;
    },

    setCommunityChallengePrivileges(data: Challenge[]): Challenge[] {
      const userPrivileges = this.getUserCommunitiesRoles;
      data.forEach((event: Event) => {
        event.actions = [];
        event.privileges = "None";
        if (userPrivileges.length > 0) {
          userPrivileges.some((value: { role: string; community: string }) => {
            if (value.role === "admin") {
              event.actions = privileges.owner;
              event.privileges = "Owner";
              return true;
            } else if (
              value.role === "owner" &&
              value.community === event.community_id
            ) {
              event.actions = privileges.owner;
              event.privileges = "Owner";
              return true;
            } else if (
              value.role === "manager" &&
              value.community === event.community_id
            ) {
              event.actions = privileges.manager;
              event.privileges = "Manager";
              return true;
            } else {
              event.actions = privileges.anyone;
              event.privileges = "anyone";
              return false;
            }
          });
        }
      });
      return data;
    },
  },
});
