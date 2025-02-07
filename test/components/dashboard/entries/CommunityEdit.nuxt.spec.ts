import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CommunityEdit from "@/components/Dashboard/entries/CommunityEdit.vue";
import { createTestingPinia, } from "@pinia/testing";
import { setActivePinia, defineStore, createPinia  } from "pinia";
import { computed, ref } from "vue";
import { mockDashboardLinks } from "@/test/mocks/dashboardMoks";
import { CommunityPrivileges } from "@/types/communities";

const mockUseRouter = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => mockUseRouter,
}));

vi.mock("@/middleware/auth", () => ({
  default: vi.fn((context) => {
    const { auth } = context;
    if (
      !auth ||
      (auth.authenticatedOnly && context.auth.status === "unauthenticated")
    ) {
      context.redirect("/login-required");
    }
  }),
}));

vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    public: {
      SCIENTIFIC_SERVICE_URL_API:
        "https://dev-openebench.bsc.es/api/scientific/staged/Metrics/",
    },
  }),
  $fetch: vi.fn(() => Promise.resolve()),
}));

global.$fetch = vi.fn(() => Promise.resolve([]));

describe("Entries Page Dashboard", () => {
  let wrapper;
  let userStore;

  beforeEach(async () => {
    setActivePinia(createPinia());

    userStore = defineStore("user", {
      state: () => ({
        userCommunities: ref([]),
      }),
      getters: {
        getUserCommunities: (state) => computed(() => state.userCommunities),
      },
    })();

    wrapper = mount(CommunityEdit, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                userCommunities: [
                  { id: 1, name: "Community A", status: "active" },
                  { id: 2, name: "Community B", status: "inactive" },
                  { id: 3, name: "Community C", status: "active" },
                ],
              },
            },
            createSpy: vi.fn,
          }),
        ],
        mocks: {
          userStore,
        },
        stubs: [
          "Multiselect",
          "FontAwesomeIcon",
          "NuxtLink",
          "UTable",
          "UInput",
        ],
      },
      props: {
        id: "1",
        communityObj: {
          id: "1",
          name: "Community A",
          description: "Description of Community A",
          links: mockDashboardLinks,
          status: "active",
          keywords: ["test", "community"],
          community_contact_ids: ["test.test1", "test.test2"],
        },
        loadingData: false,
        commmunityPrivileges: {
          community: {
            create: false,
            update: true,
            delete: false,
            read: true,
          }
        },
        isView: false,
        events: [
          { id: "1", name: "Event A" },
          { id: "2", name: "Event B" },
        ],
        isLoadingEvents: false,
        privilegesType: "community",
        tabIndex: "0",
      },
    });
  });

  it.skip("should render the component correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".dashboard-community-edit").exists()).toBe(true);
  });
});
