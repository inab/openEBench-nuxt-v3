import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Index from "@/pages/dashboard/projects_communities/index.vue";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useUser } from "@/stores/user";


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

interface CommunityRole {
  role: string;
  community: string;
}

const mockUserStore = {
  getUserCommunitiesRoles: [] as CommunityRole[],
  communitiesRoles: [] as CommunityRole[],
  fetchCommunities: vi.fn(),
  setUserCommunitiesRoles: vi.fn((roles: string[] = []) => {
    mockUserStore.getUserCommunitiesRoles = roles.reduce((accumulator, rol) => {
      if (!rol) return accumulator;
      accumulator.push(rol);
      return accumulator;
    }, [] as CommunityRole[]);
  }),
};

describe("Entries Page Dashboard", () => {
  it("should display 'Create New Entry' when the user is admin", async () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                communitiesRoles: [{ role: "admin", community: "OEBC000" }],
                getUserCommunitiesRoles: [
                  { role: "admin", community: "OEBC000" },
                ],
              },
            },
            createSpy: vi.fn,
          }),
        ],
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });

    const userStore = useUser();

    expect(userStore.getUserCommunitiesRoles).toEqual([
      { role: "admin", community: "OEBC000" },
    ]);

    expect(userStore.communitiesRoles).toEqual([
      { role: "admin", community: "OEBC000" },
    ]);

    expect(wrapper.find("#dashboard-create-community").exists()).toBe(true);
  });

  it("should not display the 'Create New Entry' button when the user is authenticated but not an admin", async () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              user: {
                communitiesRoles: [{ role: "manager", community: "OEBC000" }],
                getUserCommunitiesRoles: [
                  { role: "manager", community: "OEBC000" },
                ],
              },
            },
            createSpy: vi.fn,
          }),
        ],
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });

    expect(wrapper.find("#dashboard-create-community").exists()).toBe(false);
  });

  it("should call fetchCommunities with the correct token on mount", async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
    const userStore = useUser();

    const mockResponse = {
      data: [{ id: 1, name: "Community 1" }],
    };
  
    const fetchCommunitiesMock = vi.fn().mockResolvedValue(mockResponse);
    userStore.fetchCommunities = fetchCommunitiesMock;

    const result = await userStore.fetchCommunities("mock-token");

    const auth = useAuth();
    auth.data.value = {
      role: "admin",
      email: "hi@sidebase.io",
      name: "John Doe",
      accessToken: "mock-token",
    };
    auth.status.value = "authenticated";

    const wrapper = mount(Index, {
      global: {
        plugins: [pinia],
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });

    await wrapper.vm.$nextTick();

    expect(fetchCommunitiesMock).toHaveBeenCalledWith("mock-token");
    expect(result).toEqual(mockResponse);
  });
});
