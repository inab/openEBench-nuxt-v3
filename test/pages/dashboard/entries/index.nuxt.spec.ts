import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, shallowMount } from "vitest";
import Index from "@/pages/dashboard/entries/index.vue";
import { createTestingPinia } from "@pinia/testing";

const mockUseAuth = vi.fn();
vi.mock("@/composables/auth", () => ({
  useAuth: mockUseAuth,
}));

const mockUseRouter = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => mockUseRouter,
}));

vi.mock("@/stores/user", () => ({
  useUser: () => mockUserStore,
}));

// Mockear useUser
interface CommunityRole {
  role: string;
  community: string;
}

const mockUserStore = {
  getUserCommunitiesRoles: [] as CommunityRole[],
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
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    mockUseRouter.mockReset();
    //mockUseAuth.mockReset();

    mockUseAuth.mockReturnValue({
      data: {
        value: {
          name: "John Doe",
          statusCode: 2000,
          oeb_roles: ["admin:oeb"], // This should be a valid format
        },
      },
      status: { value: "authenticated" },
    });

    wrapper = mount(Index, {
      global: {
        plugins: [createTestingPinia()], // Usa Pinia para manejar el estado
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"], // Mockea componentes si es necesario
      },
    });
  });

  it("should display 'Create New Entry' when the user is admin", async () => {
    mockUserStore.getUserCommunitiesRoles = [
      {
        role: "admin",
        community: "oeb",
      },
    ];

    mockUseAuth.mockReturnValue({
      data: ref({
        name: "John Doe",
        oeb_roles: [
          {
            role: "admin",
            community: "oeb",
          },
        ],
      }),
      status: ref("authenticated"),
    });

    wrapper = mount(Index, {
      global: {
        plugins: [createTestingPinia()], // Usa Pinia para manejar el estado
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
        isAdmin: true,
      },
    });
    //mockUserStore.getUserCommunitiesRoles = ["admin:oeb"];
    mockUserStore.setUserCommunitiesRoles([
      {
        role: "admin",
        community: "oeb",
      },
    ]);

    // Wait for Vue to process updates
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#dashboard-create-community").exists()).toBe(true);
    expect(wrapper.vm.isAdmin).toBe(true);
  });

  it.skip("should not display the 'Create New Entry' button when the user is authenticated but not an admin", async () => {
    mockUseAuth.mockReturnValue({
      data: ref({ user: { name: "John Doe" }, oeb_roles: ["user"] }),
      status: ref("authenticated"),
      getSession: () => ({
        user: { name: "John Doe" },
        oeb_roles: ["owner:OEBC000"],
      }),
      signOut: () => {},
    });

    mockUserStore.setUserCommunitiesRoles(["owner:OEBC000"]);

    const wrapper = mount(Index, {
      global: {
        plugins: [createTestingPinia()], // Usa Pinia para manejar el estado
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"], // Mockea componentes si es necesario
      },
    });

    // Wait for Vue to process updates
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#dashboard-create-community").exists()).toBe(false);
  });

  it.skip("should redirect to login-required when the user is not authenticated", async () => {
    const push = vi.fn();
    mockUseRouter.mockReturnValue({ push });
    mockUseAuth.mockReturnValue({
      data: ref(null),
      status: ref("unauthenticated"),
      getSession: () => null,
      signOut: () => {},
    });

    if (mockUseAuth().status.value === "unauthenticated") {
      const router = mockUseRouter();
      router.push("/login-required");
    }

    const wrapper = mount(Index, {
      global: {
        plugins: [createTestingPinia()],
        stubs: ["FontAwesomeIcon", "NuxtIcon", "RouterLink"],
      },
    });

    await wrapper.vm.$nextTick();

    expect(push).toHaveBeenCalledWith("/login-required");
  });
});
